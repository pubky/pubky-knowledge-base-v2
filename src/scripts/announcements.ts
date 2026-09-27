class ScheduledAnnouncements extends HTMLElement {
  private timer: ReturnType<typeof setTimeout> | undefined;
  private entries: { element: HTMLElement; start: number; end: number }[] = [];

  connectedCallback() {
    this.entries = Array.from(this.querySelectorAll<HTMLElement>('[data-announcement]'), (element) => ({
      element,
      start: Date.parse(element.dataset.startsAt ?? ''),
      end: Date.parse(element.dataset.endsAt ?? ''),
    }));
    this.refresh();
    window.addEventListener('focus', this.refresh);
    window.addEventListener('pageshow', this.refresh);
    document.addEventListener('visibilitychange', this.refresh);
  }

  disconnectedCallback() {
    clearTimeout(this.timer);
    window.removeEventListener('focus', this.refresh);
    window.removeEventListener('pageshow', this.refresh);
    document.removeEventListener('visibilitychange', this.refresh);
  }

  private refresh = () => {
    clearTimeout(this.timer);
    const now = Date.now();
    // Recheck wall-clock changes at least once a minute; wake exactly at the
    // next boundary when it is closer. Short timers also avoid browser overflow.
    let nextCheck = now + 60_000;
    let hasActive = false;

    for (const { element, start, end } of this.entries) {
      const valid = Number.isFinite(start) && Number.isFinite(end) && end > start;
      const active = valid && start <= now && now < end;
      element.hidden = !active;
      hasActive ||= active;
      if (valid && start > now) nextCheck = Math.min(nextCheck, start);
      if (valid && end > now) nextCheck = Math.min(nextCheck, end);
    }

    this.hidden = !hasActive;
    this.timer = setTimeout(this.refresh, Math.max(1, nextCheck - now));
  };
}

if (!customElements.get('scheduled-announcements')) {
  customElements.define('scheduled-announcements', ScheduledAnnouncements);
}
