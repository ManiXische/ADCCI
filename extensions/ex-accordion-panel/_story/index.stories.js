import fileHTML from "../templates/ex-accordion-panel.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|accordion-panel", module)
  .add("Contents", () => fileHTML, {
})

