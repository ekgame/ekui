import { dispatchCustomEvent, on } from "./events";
import { PossiblyMissingElement } from "./PossiblyMissingElement";

const missingComponentProxy = new Proxy({}, {
  get(_target, _p, _receiver) {
    return () => {};
  },
});

export class AbstractComponent {
  /**
   * The tag name of the component. This should be overridden by subclasses.
   * 
   * @returns {string} - The tag name of the component.
   */
  static get componentTag() {
    throw new Error(`Component must implement the componentTag getter.`);
  }

  /**
   * AbstractComponent constructor.
   *
   * NOTE: This is an internal function and should not be called directly.
   * Use the static method `from` to create an instance.
   *
   * @param {HTMLElement} rootElement - The root element of the component.
   */
  constructor(rootElement) {
    if (!(rootElement instanceof HTMLElement)) {
      throw new Error("Invalid root element provided for AbstractComponent.");
    }

    if (!rootElement.dataset.component) {
      throw new Error("Root element must have a data-component attribute.");
    }

    // @ts-ignore
    const tag = rootElement.dataset.component;
    if (rootElement.dataset.component !== tag) {
      // @ts-ignore
      throw new Error(
        `Root element must have a data-component attribute matching ${tag}.`,
      );
    }

    this.rootElement = new PossiblyMissingElement(rootElement);
  }

  static init() {
    // This method should be overridden by subclasses to initialize the component.
  }

  /**
   * Creates an instance of the component from the root element.
   *
   * @template {typeof AbstractComponent} C
   * @this C
   *
   * @param {HTMLElement} rootElement
   * @returns {InstanceType<C>}
   */
  static from(rootElement) {
    // @ts-expect-error
    return new this(rootElement);
  }

  /**
   * Attaches an event listener to the component.
   *
   * @template {typeof AbstractComponent} C
   * @this C
   *
   * @param {string} eventName - The name of the event to listen for.
   * @param {(target: InstanceType<C>) => void} callback - The function to call when the event is triggered.
   */
  static on(eventName, callback) {
    on(`[data-component="${this.componentTag}"]`, eventName, (target) => {
      const component = this.from(target);
      callback.call(null, component);
    });
  }

  /**
   * Dispatches a custom event on the root element of the component.
   * @param {string} eventName - The name of the event to dispatch.
   * @param {Object} [detail={}] - Additional data to include in the event.
   * @returns {boolean} - Returns true if the event was successfully dispatched, false otherwise.
   */
  dispatchEvent(eventName, detail = {}) {
    const element = this.rootElement.element;
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    return dispatchCustomEvent(element, eventName, detail);
  }

  /**
   * Retrieves a child element of the component by its selector.
   * @param {string} selector - The CSS selector to match the child element.
   * @returns {PossiblyMissingElement} - An instance of PossiblyMissingElement containing the child element, or null if not found.
   */
  childElement(selector) {
    return AbstractComponent.childElement(this.rootElement, selector);
  }

  /**
   * Returns a selector that matches direct children of the component.
   * @param {string} selector - The base selector to match.
   * @returns {string} - The modified selector for direct children.
   */
  static #directChildSelector(selector) {
    return `:scope ${selector}:not(:scope [data-component] ${selector})`;
  }

  /**
   * Retrieves a child element of the component by its selector.
   *
   * @param {PossiblyMissingElement|HTMLElement|null} root - The root element of the component.
   * @param {string} selector - The CSS selector to match the child element.
   * @returns {PossiblyMissingElement} - An instance of PossiblyMissingElement containing the child element, or null if not found.
   */
  static childElement(root, selector) {
    if (root instanceof PossiblyMissingElement) {
      root = root.element;
    }

    if (!(root instanceof HTMLElement)) {
      return new PossiblyMissingElement(null);
    }

    const directChildSelector = AbstractComponent.#directChildSelector(
      selector,
    );
    const childElement = root.querySelector(directChildSelector);
    if (childElement && !(childElement instanceof HTMLElement)) {
      return new PossiblyMissingElement(null);
    }

    return new PossiblyMissingElement(childElement);
  }

  /**
   * @template {typeof AbstractComponent} C
   * @this C
   *
   * @param {HTMLElement|PossiblyMissingElement|null|AbstractComponent} rootElement
   * @returns {InstanceType<C>}
   */
  static findChildOf(rootElement) {
    if (rootElement instanceof AbstractComponent) {
      rootElement = rootElement.rootElement;
    }

    if (rootElement instanceof PossiblyMissingElement) {
      rootElement = rootElement.element;
    }

    if (!(rootElement instanceof HTMLElement)) {
      // @ts-ignore
      return missingComponentProxy;
    }

    const selector = `[data-component="${this.componentTag}"]`;
    const childElement = AbstractComponent.childElement(rootElement, selector);
    if (childElement.element === null) {
      // @ts-ignore
      return missingComponentProxy;
    }

    return this.from(childElement.element);
  }
}
