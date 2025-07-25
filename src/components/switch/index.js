
import { AbstractComponent } from "../../AbstractComponent";
import { listenForActivation, dispatchCustomEvent } from "../../utils";

export class SwitchComponent extends AbstractComponent {

  static get componentTag() {
    return 'ekui-switch';
  }

  /**
   * Initializes the switch component by setting up event listeners.
   */
  init() {
    listenForActivation(this.getRootElement(), () => {
      this.toggle();
    });
  }

  /**
   * Checks if the switch is currently in the checked state.
   * @returns {boolean} - True if the switch is checked, false otherwise.
   */
  isChecked() {
    return this.rootElement.dataset.state === 'checked';
  }

  /**
   * Toggles the switch state. If a new state is provided, it sets the switch
   * to that state; otherwise, it toggles the current state.
   * @param {boolean|null} newState - The new state to set the switch to, or null to toggle.
   */
  toggle(state = null) {
    const newState = state !== null ? state : !this.isChecked();

    if (newState === this.isChecked()) {
      return;
    }

    if (newState) {
      this.setChecked();
    } else {
      this.setUnchecked();
    }
  }

  /**
   * Sets the switch to the checked state.
   */
  setChecked() {
    const { root, thumb, input } = this.getElements();

    root.dataset.state = 'checked';
    root.setAttribute('aria-checked', 'true');
    input?.removeAttribute('disabled');

    if (thumb) {
      thumb.dataset.state = 'checked';
    }

    dispatchCustomEvent(this.getRootElement(), 'change', {
      checked: true,
    });
  }

  /**
   * Sets the switch to the unchecked state.
   */
  setUnchecked() {
    const { root, thumb, input } = this.getElements();

    root.dataset.state = 'unchecked';
    root.setAttribute('aria-checked', 'false');
    input?.setAttribute('disabled', 'disabled');

    if (thumb) {
      thumb.dataset.state = 'unchecked';
    }

    dispatchCustomEvent(this.getRootElement(), 'change', {
      checked: false,
    });
  }

  /**
   * Gets the root element of the switch component.
   * @returns {HTMLElement} - The root element of the switch component.
   **/
  getRootElement() {
    return this.rootElement;
  }

  /**
   * Gets the thumb element of the switch component.
   * @returns {HTMLElement|null} - The thumb element of the switch component.
   **/
  getThumbElement() {
    return this.rootElement.querySelector('[data-component="ekui-switch-thumb"]');
  }

  /**
   * Gets the input element of the switch component.
   * @returns {HTMLInputElement|null} - The input element of the switch component.
   **/
  getInputElement() {
    return this.rootElement.querySelector('input[type="hidden"]');
  }

  /**
   * Gets all relevant elements of the switch component.
   * @returns {{
   *   root: HTMLElement,
   *   thumb: HTMLElement|null,
   *   input: HTMLInputElement|null
   * }} - An object containing the root, thumb, and input elements.
   **/
  getElements() {
    return {
      root: this.getRootElement(),
      thumb: this.getThumbElement(),
      input: this.getInputElement(),
    };
  }
}