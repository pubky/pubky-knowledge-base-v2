interface ClipboardOptions {
  text: string | (() => string);
  status: HTMLElement;
  successMessage: string;
  failureMessage: string;
  successAriaLabel: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}

// Buttons such as the SDK tabs share a live region. Only the latest attempt
// may update it, including when clipboard promises resolve out of order.
const statusOwners = new WeakMap<HTMLElement, symbol>();

export function enhanceClipboardButton(button: HTMLButtonElement, options: ClipboardOptions) {
  if (button.dataset.copyReady) return;
  button.dataset.copyReady = 'true';
  button.hidden = false;

  const label = button.querySelector<HTMLElement>('[data-copy-label]');
  const originalLabel = label?.textContent ?? '';
  const originalAriaLabel = button.getAttribute('aria-label');
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  function resetButton() {
    if (label) label.textContent = originalLabel;
    if (originalAriaLabel === null) button.removeAttribute('aria-label');
    else button.setAttribute('aria-label', originalAriaLabel);
  }

  button.addEventListener('click', async () => {
    clearTimeout(resetTimer);
    resetButton();
    const attempt = Symbol();
    statusOwners.set(options.status, attempt);
    options.status.textContent = '';
    button.disabled = true;

    try {
      const text = typeof options.text === 'function' ? options.text() : options.text;
      await navigator.clipboard.writeText(text);
    } catch {
      if (statusOwners.get(options.status) === attempt) {
        options.status.textContent = options.failureMessage;
      }
      options.onFailure?.();
      return;
    } finally {
      button.disabled = false;
    }

    if (label) label.textContent = 'Copied';
    button.setAttribute('aria-label', options.successAriaLabel);
    if (statusOwners.get(options.status) === attempt) {
      options.status.textContent = options.successMessage;
    }
    resetTimer = setTimeout(() => {
      resetButton();
      if (statusOwners.get(options.status) === attempt) {
        options.status.textContent = '';
      }
    }, 2500);
    options.onSuccess?.();
  });
}
