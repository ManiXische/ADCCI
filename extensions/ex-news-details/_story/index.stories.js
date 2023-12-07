import fileHTML from "../templates/ex-news-details.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|news-details", module)
  .add("Contents", () => fileHTML, {
  })
