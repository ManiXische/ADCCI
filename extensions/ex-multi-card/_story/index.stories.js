import fileHTML from "../templates/ex-multi-card.html";
import fileHTMLRTL from "../templates/ex-multi-card-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|multi-card", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

