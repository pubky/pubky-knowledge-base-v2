/** A bounded decorative network; the existing CSS mesh remains the fallback. */
const controllers = new Map<HTMLElement, () => void>();
const FRAME_INTERVAL = 1000 / 20;
const NODE_COUNT = 112;
const SWEEP_CYCLE = 12_000;
const SWEEP_START = 1_080;
const SWEEP_DURATION = 2_520;

type Edge = { from: number; to: number; stable: boolean; phase: number };

function createNetwork(root: HTMLElement): () => void {
  const watermark = root.querySelector<HTMLElement>('.ai-resources-watermark');
  const canvas = root.querySelector<HTMLCanvasElement>('.ai-network-canvas');
  if (!watermark || !canvas || !window.IntersectionObserver || !window.ResizeObserver) {
    return () => {};
  }

  const context = canvas.getContext('2d');
  const mask = document.createElement('canvas');
  const maskContext = mask.getContext('2d');
  if (!context || !maskContext) return () => {};

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    x: 0,
    y: 0,
    phase: Math.random() * Math.PI * 2,
  }));
  let edges: Edge[] = [];
  let maskPixels: ImageData['data'] | undefined;
  let disposed = false;
  let failed = false;
  let visible = false;
  let fontsReady = false;
  let ready = false;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let ink = '';
  let frame: number | undefined;
  let previousTime = 0;
  let lastDraw = 0;
  let elapsed = 0;

  function insideMask(x: number, y: number): boolean {
    if (!maskPixels || x < 0 || y < 0 || x >= width || y >= height) return false;
    const column = Math.min(mask.width - 1, Math.floor(x * pixelRatio));
    const row = Math.min(mask.height - 1, Math.floor(y * pixelRatio));
    return (maskPixels[(row * mask.width + column) * 4 + 3] ?? 0) > 160;
  }

  function seedGraph() {
    // Farthest-point sampling spreads nodes through the actual strokes of both
    // letters, including their contours, instead of wasting nodes in empty space.
    const candidates: Array<{ x: number; y: number; distance: number }> = [];
    const step = Math.max(2, Math.min(width, height) / 32);
    for (let y = step / 2; y < height && candidates.length < 4096; y += step) {
      for (let x = step / 2; x < width && candidates.length < 4096; x += step) {
        if (insideMask(x, y)) candidates.push({ x, y, distance: Infinity });
      }
    }
    if (!candidates.length) throw new Error('The decorative glyph mask is empty.');
    let next = 0;
    nodes.forEach((node, index) => {
      const point = candidates[next]!;
      node.x = point.x / width;
      node.y = point.y / height;
      point.distance = -1;
      let farthest = -1;
      next = index % candidates.length;
      candidates.forEach((candidate, candidateIndex) => {
        if (candidate.distance < 0) return;
        const distance = (point.x - candidate.x) ** 2 + (point.y - candidate.y) ** 2;
        candidate.distance = Math.min(candidate.distance, distance);
        if (candidate.distance > farthest) {
          farthest = candidate.distance;
          next = candidateIndex;
        }
      });
    });

    // Seven candidate neighbors per node cap the graph at 784 unique edges.
    // Four nearby connections hold the letter shapes as the others fade/reform.
    const connections = new Map<number, Edge>();
    nodes.forEach((node, index) => {
      const nearest = nodes.map((other, otherIndex) => ({
        index: otherIndex,
        distance: ((node.x - other.x) * width) ** 2 + ((node.y - other.y) * height) ** 2,
      })).filter((other) => other.index !== index)
        .sort((a, b) => a.distance - b.distance).slice(0, 7);
      nearest.forEach((other, rank) => {
        const from = Math.min(index, other.index);
        const to = Math.max(index, other.index);
        const key = from * NODE_COUNT + to;
        const existing = connections.get(key);
        if (existing) existing.stable ||= rank < 4;
        else connections.set(key, {
          from, to, stable: rank < 4, phase: nodes[from]!.phase + nodes[to]!.phase,
        });
      });
    });
    edges = [...connections.values()];
  }

  function draw() {
    if (!context || !ready) return;
    const time = elapsed / 1000 * 2.025;
    const drift = Math.min(width, height) * 0.018;
    const points = nodes.map((node) => {
      const anchor = { x: node.x * width, y: node.y * height };
      let x = anchor.x + Math.sin(time * 0.45 + node.phase) * drift;
      let y = anchor.y + Math.cos(time * 0.37 + node.phase) * drift;
      if (!insideMask(x, y)) {
        x = (x + anchor.x) / 2;
        y = (y + anchor.y) / 2;
      }
      return insideMask(x, y) ? { x, y } : anchor;
    });
    const cycleTime = elapsed % SWEEP_CYCLE;
    const sweeping = cycleTime >= SWEEP_START && cycleTime < SWEEP_START + SWEEP_DURATION;
    const band = Math.max(width, height) * 0.16;
    const progress = (cycleTime - SWEEP_START) / SWEEP_DURATION;
    const center = -band + (width + height * 0.3 + band * 2) * progress;
    const lightAt = (x: number, y: number) => sweeping
      ? Math.max(0, 1 - Math.abs(x + y * 0.3 - center) / band) ** 2
      : 0;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.strokeStyle = ink;
    context.fillStyle = ink;
    context.lineWidth = 0.85;
    context.lineCap = 'round';
    edges.forEach((edge) => {
      const from = points[edge.from]!;
      const to = points[edge.to]!;
      const formation = (Math.sin(time * 0.55 + edge.phase) + 1) / 2;
      if (!edge.stable && formation < 0.2) return;
      const glint = lightAt((from.x + to.x) / 2, (from.y + to.y) / 2);
      context.globalAlpha = Math.min(1, (edge.stable ? 0.28 : 0.1) + formation * 0.32 + glint * 0.6);
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    });
    points.forEach((point, index) => {
      const pulse = (Math.sin(time * 0.8 + nodes[index]!.phase) + 1) / 2;
      const glint = lightAt(point.x, point.y);
      context.globalAlpha = 0.05 + glint * 0.1;
      context.beginPath();
      context.arc(point.x, point.y, 3, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = Math.min(1, 0.5 + pulse * 0.2 + glint * 0.5);
      context.beginPath();
      context.arc(point.x, point.y, 1.2 + glint * 0.5, 0, Math.PI * 2);
      context.fill();
    });
    // Only strokes and points reach the visible canvas; the glyph is an alpha
    // mask, never a painted silhouette. The shimmer only changes their light.
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'destination-in';
    context.drawImage(mask, 0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
  }

  function stop() {
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
    previousTime = 0;
    root.dataset.aiRunning = 'false';
  }

  function tick(now: number) {
    if (disposed || root.dataset.aiRunning !== 'true') return;
    if (previousTime) elapsed += Math.min(now - previousTime, 100);
    previousTime = now;
    if (now - lastDraw >= FRAME_INTERVAL) {
      try {
        draw();
      } catch {
        failed = true;
        sync();
        return;
      }
      lastDraw = now;
    }
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    if (disposed) return;
    const reduced = reducedMotion.matches;
    const usable = ready && fontsReady && !failed && !reduced;
    root.dataset.aiMotion = reduced ? 'reduced' : 'playing';
    if (usable) root.dataset.aiNetworkReady = 'true';
    else delete root.dataset.aiNetworkReady;
    const running = usable && visible && !document.hidden;
    if (!running) {
      stop();
    } else if (frame === undefined) {
      previousTime = 0;
      root.dataset.aiRunning = 'true';
      frame = requestAnimationFrame(tick);
    }
  }

  function resize() {
    if (disposed || failed || !fontsReady || !watermark || !canvas || !maskContext) return;
    if (reducedMotion.matches) {
      sync();
      return;
    }
    try {
      const styles = getComputedStyle(watermark);
      width = Math.min(512, Math.max(1, parseFloat(styles.width) || watermark.clientWidth));
      height = Math.min(512, Math.max(1, parseFloat(styles.height) || watermark.clientHeight));
      pixelRatio = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      canvas.width = mask.width = Math.ceil(width * pixelRatio);
      canvas.height = mask.height = Math.ceil(height * pixelRatio);
      ink = styles.getPropertyValue('--base-foreground').trim();
      const fontSize = parseFloat(styles.fontSize);
      maskContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      maskContext.font = `${styles.fontWeight} ${fontSize}px ${styles.fontFamily}`;
      maskContext.textBaseline = 'alphabetic';
      maskContext.fillStyle = ink;
      const metrics = maskContext.measureText('AI');
      const ascent = metrics.fontBoundingBoxAscent ?? fontSize * 0.8;
      const descent = metrics.fontBoundingBoxDescent ?? fontSize * 0.2;
      const baseline = (height - ascent - descent) / 2 + ascent;
      const supportsTracking = typeof (maskContext as Partial<CanvasRenderingContext2D>).letterSpacing === 'string';
      if (supportsTracking) {
        maskContext.letterSpacing = styles.letterSpacing;
        maskContext.fillText('AI', 0, baseline);
      } else {
        const tracking = parseFloat(styles.letterSpacing) || 0;
        maskContext.fillText('A', 0, baseline);
        maskContext.fillText('I', maskContext.measureText('A').width + tracking, baseline);
      }
      maskPixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
      seedGraph();
      ready = true;
      if (visible && !document.hidden) draw();
    } catch {
      failed = true;
      ready = false;
    }
    sync();
  }

  reducedMotion.addEventListener('change', () => {
    resize();
    sync();
  }, { signal: events.signal });
  document.addEventListener('visibilitychange', sync, { signal: events.signal });
  canvas.addEventListener('contextlost', () => {
    failed = true;
    sync();
  }, { signal: events.signal });
  const intersection = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting);
    sync();
  });
  intersection.observe(root);
  const dimensions = new ResizeObserver(resize);
  dimensions.observe(watermark);
  document.fonts.addEventListener('loadingdone', resize, { signal: events.signal });
  void document.fonts.ready.then(() => {
    if (disposed) return;
    fontsReady = true;
    resize();
  });
  sync();

  return () => {
    disposed = true;
    stop();
    events.abort();
    intersection.disconnect();
    dimensions.disconnect();
    delete root.dataset.aiMotion;
    delete root.dataset.aiRunning;
    delete root.dataset.aiNetworkReady;
    maskPixels = undefined;
    edges = [];
    canvas.width = canvas.height = mask.width = mask.height = 0;
  };
}

function mountNetworks() {
  controllers.forEach((dispose, root) => {
    if (!root.isConnected) {
      dispose();
      controllers.delete(root);
    }
  });
  document.querySelectorAll<HTMLElement>('.ai-resources').forEach((root) => {
    if (!controllers.has(root)) controllers.set(root, createNetwork(root));
  });
}

function disposeNetworks() {
  controllers.forEach((dispose) => dispose());
  controllers.clear();
}

mountNetworks();
window.addEventListener('pagehide', disposeNetworks);
window.addEventListener('pageshow', mountNetworks);

export {};
