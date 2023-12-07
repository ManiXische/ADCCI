import fileHTML from "../templates/ex-header.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|header", module)
  .add("Contents", () => fileHTML, {
  })
