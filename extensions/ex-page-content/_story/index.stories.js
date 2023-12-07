import fileHTML from "../templates/ex-page-content.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|page-content", module)
  .add("Contents", () => fileHTML, {
  })
