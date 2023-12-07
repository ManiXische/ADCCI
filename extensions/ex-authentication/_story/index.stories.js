import fileHTML from "../templates/ex-authentication.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|authentication", module)
  .add("Contents", () => fileHTML, {
})

