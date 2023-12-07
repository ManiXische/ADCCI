import fileHTML from "../templates/ex-polls.html";
import { storiesOf } from '@storybook/html';

export default { title: 'polls' };

storiesOf("Components|polls", module)
  .add("Contents", () => fileHTML, {
})

