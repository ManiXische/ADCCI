import fileHTML from "../templates/templ-ADCloud.html";
import fileHTMLRTL from "../templates/templ-ADCloud-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|ADCloud", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

