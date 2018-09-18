import fetch from '@wikia/ember-fandom/services/fetch';
import { inject as service } from '@ember/service';

export default fetch.extend({
  runtimeConfig: service(),

  init() {
    this.config = {
      internalCache: this.runtimeConfig.internalCache,
      servicesExternalHost: this.runtimeConfig.servicesExternalHost,
      servicesInternalHost: this.runtimeConfig.servicesInternalHost,
    };

    this._super(...arguments);
  },
});
