import fileHTML from "../templates/ex-banner.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|banner", module)
  .add("Contents", () => fileHTML, {
  })
