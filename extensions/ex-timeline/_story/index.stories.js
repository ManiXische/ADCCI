import fileHTML from "../templates/ex-timeline.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|timeline", module)
  .add("Contents", () => fileHTML, {
})

