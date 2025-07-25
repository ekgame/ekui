/**
 * Listens for activation events on the specified element.
 * @param {HTMLElement} element - The element to listen for activation events on.
 * @param {Function} callback - The function to call when the element is activated.
 */
export function listenForActivation(element, callback) {
  if (!(element instanceof HTMLElement)) {
    throw new Error('Invalid element provided for activation listener.');
  }

  element.addEventListener('click', callback);
}

/**
 * Dispatches a custom event.
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