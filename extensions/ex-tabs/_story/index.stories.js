import fileHTML from "../templates/ex-tabs.html";
import fileHTMLRTL from "../templates/ex-tabs-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|tabs", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

