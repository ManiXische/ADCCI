import fileHTML from "../templates/ex-news-cards.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|news-cards", module)
  .add("Contents", () => fileHTML, {
  })
