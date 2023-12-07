import fileHTML from "../templates/ex-youtube-grid.html";
import fileHTMLRTL from "../templates/ex-youtube-grid-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|youtube-grid", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

