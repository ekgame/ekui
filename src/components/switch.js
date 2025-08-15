import { AbstractComponent } from "#root/AbstractComponent.js";

export class SwitchRootComponent extends AbstractComponent {
  static get componentTag() {
    return 'cc-switch-root';
  }

  static init() {
    this.on('click', (target) => target.toggle());
  }
  
  /**
   * Toggle the switch or set it to a specific state.
   * @param {boolean|null} state - If true, sets the switch to checked; if false,
   * sets it to unchecked; if null, toggles the current state.
   */
  toggle(state = null) {
    const oldState = this.isChecked();
    const newState = state !== null ? state : !this.isChecked();

    if (newState) {
      this.#setChecked();
    } else {
      this.#setUnchecked();
    }

    if (oldState === newState) {
      return;
    }

    this.dispatchEvent('change', {
      checked: newState,
    });
  }

  /**
   * Checks if the switch is currently in the checked state.
   * 
   * @returns {boolean} - True if the switch is checked, false otherwise.
   */
  isChecked() {
    return this.rootElement.getData('state') === 'checked';
  }

  #setChecked() {
    this.rootElement.setData('state', 'checked');
    this.rootElement.setAttribute('aria-checked', 'true');
    this.#inputComponent.setEnabled();
    this.#thumbComponent.setEnabled();
  }

  #setUnchecked() {
    this.rootElement.setData('state', 'unchecked');
    this.rootElement.setAttribute('aria-checked', 'false');
    this.#inputComponent.setDisabled();
    this.#thumbComponent.setDisabled();
  }

  get #inputComponent() {
    return SwitchInputComponent.findChildOf(this);
  }

  get #thumbComponent() {
    return SwitchThumbComponent.findChildOf(this);
  }
}

export class SwitchThumbComponent extends AbstractComponent {
  static get componentTag() {
    return 'cc-switch-thumb';
  }

  setEnabled() {
    this.rootElement.setData('state', 'checked');
  }

  setDisabled() {
    this.rootElement.setData('state', 'unchecked');
  }
}

export class SwitchInputComponent extends AbstractComponent {
  static get componentTag() {
    return 'cc-switch-input';
  }

  setEnabled() {
    this.rootElement.setAttribute('disabled', null);
  }

  setDisabled() {
    this.rootElement.setAttribute('disabled', 'disabled');
  }
}