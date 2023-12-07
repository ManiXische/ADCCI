import fileHTML from "../templates/ex-publications.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|publications", module)
  .add("Contents", () => fileHTML, {
})

