export class PossiblyMissingElement {
  #element;

  /**
   * Creates a new PossiblyMissingElement instance.
   *
   * @param {HTMLElement|null} element - The HTML element or null.
   */
  constructor(element) {
    if (element && !(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided for PossiblyMissingElement.");
    }

    this.#element = element;
  }

  /**
   * Retrieves the underlying HTML element.
   *
   * @returns {HTMLElement|null} The HTML element or null if it doesn't exist.
   */
  get element() {
    return this.#element;
  }

  /**
   * Sets an attribute on the underlying HTML element.
   *
   * @param {string} name - The name of the attribute.
   * @param {string|number|boolean|null|undefined} value - The value of the attribute.
   * @returns {void}
   */
  setAttribute(name, value) {
    const element = this.#element;
    if (!element) {
      return;
    }

    if (value === null || value === undefined) {
      element.removeAttribute(name);
      return;
    }

    if (typeof value === "boolean") {
      value = value ? "true" : "false";
    } else if (typeof value === "number") {
      value = value.toString();
    } else if (typeof value !== "string") {
      throw new Error(
        `Invalid value type for attribute '${name}': ${typeof value}`,
      );
    }

    element.setAttribute(name, value);
  }

  /**
   * Retrieves the value of a data attribute from the underlying element.
   *
   * @param {string} name - The name of the data attribute (without the 'data-' prefix).
   * @returns {string|null} The value of the data attribute if it exists, otherwise null.
   */
  getData(name) {
    const element = this.#element;
    if (!element) {
      return null;
    }

    return element.dataset[name] || null;
  }

  /**
   * Sets a data attribute on the underlying HTML element.
   *
   * @param {string} name - The name of the data attribute (without the 'data-' prefix).
   * @param {string|number|boolean|null|undefined} value - The value to set for the data attribute.
   * @returns {void}
   */
  setData(name, value) {
    const element = this.#element;
    if (!element) {
      return;
    }

    if (value === null || value === undefined) {
      element.dataset[name] = "";
      return;
    }

    element.dataset[name] = value.toString();
  }
}
