import { SwitchComponent } from "./components/switch";

document.addEventListener('DOMContentLoaded', () => {
  SwitchComponent.init();
});

const components = {
  SwitchComponent,
};

window.ekui = components;
export default components;