import fileHTML from "../templates/ex-floating-action-button.html";
import fileHTMLRTL from "../templates/ex-floating-action-button-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|floating-action-button", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

