import fileHTML from "../templates/ex-timeline-horizontal.html";
import fileHTMLRTL from "../templates/ex-timeline-horizontal-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|timeline-horizontal", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

