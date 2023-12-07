import fileHTML from "../templates/ex-newsletter-subscription.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|newsletter-subscription", module)
  .add("Contents", () => fileHTML, {
  })
