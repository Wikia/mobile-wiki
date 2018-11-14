import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

import { WikiIsClosedError } from '../utils/errors';

export default Mixin.create({
  fastboot: service(),
  wikiVariables: service(),

  beforeModel() {
    this._super(...arguments);

    if (this.wikiVariables.isClosed) {
      throw new WikiIsClosedError();
    }
  },
});
