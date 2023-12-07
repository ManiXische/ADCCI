import fileHTML from "../templates/ex-main-theme.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|main-theme", module)
  .add("Contents", () => fileHTML, {
  })
