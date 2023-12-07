import fileHTML from "../templates/ex-master-card.html";
import fileHTMLRTL from "../templates/ex-master-card-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|master-card", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

