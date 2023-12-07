import fileHTML from "../templates/templ-ex-publications-v2.html";
import fileHTMLRTL from "../templates/templ-ex-publications-v2-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|ex-publications-v2", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

