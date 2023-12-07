import fileHTML from "../templates/ex-defaultsite.html";
import fileHTMLRTL from "../templates/ex-defaultsite-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|defaultsite", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

