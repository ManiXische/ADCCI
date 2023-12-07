import fileHTML from "../templates/ex-service-card.html";
import fileHTMLRTL from "../templates/ex-service-card-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|service-card", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

