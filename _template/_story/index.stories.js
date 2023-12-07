import fileHTML from "../templates/templ-###ext###.html";
import fileHTMLRTL from "../templates/templ-###ext###-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|###ext###", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

