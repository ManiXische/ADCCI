import fileHTML from "../templates/ex-announcement.html";
import fileHTMLRTL from "../templates/ex-announcement-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|announcement", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

