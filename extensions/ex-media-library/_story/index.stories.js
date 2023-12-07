import fileHTML from "../templates/ex-media-library.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|media-library", module)
  .add("Contents", () => fileHTML, {
  })
