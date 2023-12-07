import fileHTML from "../templates/ex-quote.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|quote", module)
  .add("Contents", () => fileHTML, {
  })
