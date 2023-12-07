import fileHTML from "../templates/ex-generic-map.html";
import fileHTMLRTL from "../templates/ex-generic-map-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|generic-map", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

