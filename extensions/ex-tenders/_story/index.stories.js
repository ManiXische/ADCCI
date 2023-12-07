import fileHTML from "../templates/templ-ex-tenders.html";
import fileHTMLRTL from "../templates/templ-ex-tenders-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|ex-tenders", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

