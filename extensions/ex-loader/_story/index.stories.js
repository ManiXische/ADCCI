import fileHTML from "../templates/ex-loader.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|loader", module)
  .add("Contents", () => fileHTML, {
  })
