import fileHTML from "../templates/ex-live-monitoring.html";
import fileHTMLRTL from "../templates/ex-live-monitoring-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|live-monitoring", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

