const TIMEOUT = 5000;

/**
 * Polls for an element until dom ready
 * and executes a callback when the element(s) is/are found
 * Note: Runs at least once even if dom ready
 *
 * @param {string} selector - The element selector to poll for
 * @param {whenCallback} callback - Callback when element found
 * @param {number} [interval=50] - Polling interval in milliseconds
 * @param {number} [timer=0] - How long the poller has been running
 *
 * @example
 *
 *    when('.target-class', targetElement => {
 *      // Do something with targetElement
 *    });
 */
export default function when(selector, callback, interval = 50, timer = 0) {
  const elements = document.querySelectorAll(selector);

  // If element found, call callback
  if (elements.length) return callback(elements);

  if (timer > TIMEOUT) {
    console.warn('Element not found, ', selector);
    return;
  }

  // Else, try again
  const next = when.bind(null, selector, callback, interval, timer += interval);
  return setTimeout(next, interval);
}