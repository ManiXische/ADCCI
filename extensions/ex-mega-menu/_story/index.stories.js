import fileHTML from "../templates/ex-mega-menu.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|mega-menu", module)
  .add("Contents", () => fileHTML, {
})

