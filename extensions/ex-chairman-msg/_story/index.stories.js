import fileHTML from "../templates/ex-chairman-msg.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|chairman-msg", module)
  .add("Contents", () => fileHTML, {
  })
