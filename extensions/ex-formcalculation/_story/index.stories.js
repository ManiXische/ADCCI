import fileHTML from "../templates/ex-formcalculation.html";
import fileHTMLRTL from "../templates/ex-formcalculation-rtl.html";
import { storiesOf } from '@storybook/html';

storiesOf("Components|formcalculation", module)
  .add("Contents", () => fileHTML, {
  })
  .add("Contents RTL", () => fileHTMLRTL, {
  })

