export class AbstractComponent {
  static get componentTag() {
    throw new Error(`Component must implement the componentTag getter.`);
  }

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

  init() {
    // This method should be overridden by subclasses to set up event listeners or other initialization logic.
  }

  static initAll() {
    document
      .querySelectorAll(`[data-component="${this.componentTag}"]`)
      .forEach((element) => new this(element).init());
  }
}
