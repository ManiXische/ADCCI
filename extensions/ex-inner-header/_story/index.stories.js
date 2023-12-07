import fileHTML from "../templates/ex-inner-header.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|inner-header", module)
  .add("Contents", () => fileHTML, {
  })
