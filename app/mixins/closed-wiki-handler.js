import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

import { WikiIsClosedError } from '../utils/errors';

export default Mixin.create({
  fastboot: service(),
  wikiVariables: service(),

  /**
   * @param {Object} model
   * @param {Ember.Transition} transition
   * @returns {void}
   */
  beforeModel(model, transition) {
    this._super(...arguments);

    if (this.wikiVariables.isClosed) {
      throw new WikiIsClosedError();
    }
  },

  actions: {
    error(error) {
      // Error handler in application route will take care of it
      if (error instanceof WikiIsClosedError) {
        return true;
      }
    }
  },
});
