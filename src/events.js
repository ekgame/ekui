/**
 * Attaches an event listener to a specific element that matches the given selector.
 * 
 * @param {string} selector - The CSS selector to match the element.
 * @param {string} eventName - The name of the event to listen for.
 * @param {(target: HTMLElement, event: Event) => void} callback - The function to call when the event is triggered.
 */
export function on(selector, eventName, callback) {
  document.addEventListener(eventName, function (event) {
    const originalTarget = event.target;
    if (!originalTarget || !(originalTarget instanceof HTMLElement)) {
      return;
    }

    const target = originalTarget.closest(selector);
    if (!target || !(target instanceof HTMLElement)) {
      return;
    }

    callback.call(null, target, event);
  });
}

/**
 * Dispatches a custom event.
 * 
 * @param {HTMLElement} element - The element to dispatch the event on.
 * @param {string} eventName - The name of the event to dispatch.
 * @param {Object} [detail={}] - Additional data to include in the event.
 * @returns {boolean} - Returns true if the event was successfully dispatched, false otherwise.
 */
export function dispatchCustomEvent(element, eventName, detail = {}) {
  if (!(element instanceof HTMLElement)) {
    throw new Error('Invalid element provided for UI event.');
  }

  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    composed: true,
  });
  
  return element.dispatchEvent(event);
}