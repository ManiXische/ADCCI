import fileHTML from "../templates/ex-happiness-meter.html";
import { storiesOf } from '@storybook/html';


 storiesOf("Components|happiness-meter", module)
  .add("Contents", () => fileHTML, {
  })
