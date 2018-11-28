import * as style from './styles.css';

function createSnack(message, options) {
  const { timeout = 0, actions = ['dismiss'] } = options;

  const el = document.createElement('div');
  el.className = style.snackbar;
  el.setAttribute('aria-live', 'assertive');
  el.setAttribute('aria-atomic', 'true');
  el.setAttribute('aria-hidden', 'false');

  const text = document.createElement('div');
  text.className = style.text;
  text.textContent = message;
  el.appendChild(text);

  const result = new Promise((resolve) => {
    let timeoutId;

    // Add action buttons
    actions.forEach((action) => {
      const button = document.createElement('button');
      button.className = style.button;
      button.textContent = action;

      button.addEventListener('click', () => {
        clearTimeout(timeoutId);
        resolve(action);
      });

      el.appendChild(button);
    });

    // Add timeout
    if (timeout) {
      timeoutId = window.setTimeout(() => resolve(''), timeout);
    }
  });

  return [el, result];
}

export default class SnackBarElement extends HTMLElement {
  snackbars = [];

  processingQueue = false;

  /**
   * Show a snackbar. Returns a promise for the name of the action clicked, or an empty string if no
   * action is clicked.
   */
  showSnackbar(message, options) {
    return new Promise((resolve) => {
      this.snackbars.push([message, options, resolve]);
      if (!this.processingQueue) this.processQueue();
    });
  }

  async processQueue() {
    this.processingQueue = true;

    while (this.snackbars[0]) {
      const [message, options, resolver] = this.snackbars[0];
      const [el, result] = createSnack(message, options);

      // Pass the result back to the original showSnackbar call.
      resolver(result);
      this.appendChild(el);

      // Wait for the user to click an action, or for the snack to timeout.
      await result;

      // Transition the snack away.
      el.setAttribute('aria-hidden', 'true');
      await new Promise((resolve) => {
        el.addEventListener('animationend', () => resolve());
      });
      el.remove();

      this.snackbars.shift();
    }

    this.processingQueue = false;
  }
}

customElements.define('snack-bar', SnackBarElement);
