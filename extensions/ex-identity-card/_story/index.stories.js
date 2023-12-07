import fileHTML from "../templates/ex-identity-card.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|identity-card", module)
  .add("Contents", () => fileHTML, {
  })
