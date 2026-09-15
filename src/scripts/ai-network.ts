/** A bounded decorative network; the existing CSS mesh remains the fallback. */
const controllers = new Map<HTMLElement, () => void>();
const FRAME_INTERVAL = 1000 / 20;
const NODE_COUNT = 24;

function createNetwork(root: HTMLElement): () => void {
  const watermark = root.querySelector<HTMLElement>('.ai-resources-watermark');
  const canvas = root.querySelector<HTMLCanvasElement>('.ai-network-canvas');
  const toggle = root.querySelector<HTMLButtonElement>('[data-ai-motion-toggle]');
  if (!watermark || !canvas || !toggle || !window.IntersectionObserver || !window.ResizeObserver) {
    return () => {};
  }

  const context = canvas.getContext('2d');
  const mask = document.createElement('canvas');
  const maskContext = mask.getContext('2d');
  if (!context || !maskContext) return () => {};

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const nodes = Array.from({ length: NODE_COUNT }, (_, index) => ({
    x: ((index % 4) + 0.5 + (Math.random() - 0.5) * 0.6) / 4,
    y: (Math.floor(index / 4) + 0.5 + (Math.random() - 0.5) * 0.6) / 6,
    phase: Math.random() * Math.PI * 2,
  }));
  let disposed = false;
  let failed = false;
  let paused = false;
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

  function draw() {
    if (!context || !ready) return;
    const time = elapsed / 1000;
    const points = nodes.map((node) => ({
      x: (node.x + Math.sin(time * 0.32 + node.phase) * 0.055) * width,
      y: (node.y + Math.cos(time * 0.25 + node.phase) * 0.045) * height,
    }));
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.strokeStyle = ink;
    context.fillStyle = ink;
    context.lineWidth = 0.8;
    const reach = Math.max(width, height) * 0.34;

    // At most three forward connections per node; edge phases form new paths.
    points.forEach((point, index) => {
      let connections = 0;
      for (let other = index + 1; other < points.length && connections < 3; other++) {
        const target = points[other]!;
        const distance = Math.hypot(point.x - target.x, point.y - target.y);
        const formation = Math.sin(time * 0.52 + index * 1.7 + other * 0.9);
        if (distance >= reach || formation <= -0.25) continue;
        context.globalAlpha = (1 - distance / reach) * (formation + 0.25) * 0.65;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(target.x, target.y);
        context.stroke();
        connections++;
      }
    });
    points.forEach((point, index) => {
      const pulse = (Math.sin(time * 0.8 + nodes[index]!.phase) + 1) / 2;
      context.globalAlpha = 0.1;
      context.beginPath();
      context.arc(point.x, point.y, 4 + pulse, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 0.65 + pulse * 0.35;
      context.beginPath();
      context.arc(point.x, point.y, 1.4 + pulse * 0.6, 0, Math.PI * 2);
      context.fill();
    });
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
    if (disposed || !toggle) return;
    const reduced = reducedMotion.matches;
    const usable = ready && fontsReady && !failed && !reduced;
    root.dataset.aiMotion = reduced ? 'reduced' : paused ? 'paused' : 'playing';
    if (usable) root.dataset.aiNetworkReady = 'true';
    else delete root.dataset.aiNetworkReady;
    toggle.hidden = !usable;
    toggle.textContent = paused ? 'Play motion' : 'Pause motion';
    toggle.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} motion in the AI lettering`);
    const running = usable && !paused && visible && !document.hidden;
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
      ready = true;
      if (visible && !document.hidden) draw();
    } catch {
      failed = true;
      ready = false;
    }
    sync();
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    sync();
  }, { signal: events.signal });
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
    toggle.hidden = true;
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
document.addEventListener('astro:page-load', mountNetworks);
document.addEventListener('astro:before-swap', disposeNetworks);
window.addEventListener('pagehide', disposeNetworks);
window.addEventListener('pageshow', mountNetworks);

export {};
