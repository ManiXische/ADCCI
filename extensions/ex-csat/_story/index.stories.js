import fileHTML from "../templates/ex-csat.html";
import fileHTMLRTL from "../templates/ex-csat-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|csat", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

