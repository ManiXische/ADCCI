import fileHTML from "../templates/ex-new-member.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|new-member", module)
  .add("Contents", () => fileHTML, {
  })
