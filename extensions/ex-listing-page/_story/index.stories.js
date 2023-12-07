import fileHTML from "../templates/templ-ex-listing-page.html";
import fileHTMLRTL from "../templates/templ-ex-listing-page-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|ex-listing-page", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

