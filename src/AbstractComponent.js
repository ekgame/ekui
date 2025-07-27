export class AbstractComponent {
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
      throw new Error('Invalid root element provided for AbstractComponent.');
    }

    if (!rootElement.dataset.component) {
      throw new Error('Root element must have a data-component attribute.');
    }

    if (rootElement.dataset.component !== this.constructor.componentTag) {
      throw new Error(`Root element must have a data-component attribute matching ${this.constructor.componentTag}.`);
    }

    this.rootElement = rootElement;
  }

  static init() {
    // This method should be overridden by subclasses to initialize the component.
  }

  /**
   * Creates an instance of the component from the root element.
   * 
   * @param {HTMLElement} rootElement - The root element of the component.
   * @returns {AbstractComponent} - The created component instance.
   */
  static from(rootElement) {
    return new this(rootElement);
  }

  static select(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`No element found for selector: ${selector}`);
    }

    return this.from(element);
  }

  static selectAll(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      throw new Error(`No elements found for selector: ${selector}`);
    }

    return Array.from(elements).map(element => this.from(element));
  }
}
