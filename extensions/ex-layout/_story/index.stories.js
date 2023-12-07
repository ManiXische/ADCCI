import fileHTML from "../templates/ex-layout.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|layout", module)
  .add("Contents", () => fileHTML, {
  })
