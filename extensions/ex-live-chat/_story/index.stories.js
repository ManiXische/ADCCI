import fileHTML from "../templates/ex-live-chat.html";
import fileHTMLRTL from "../templates/ex-live-chat-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|live-chat", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

