import fetch from '@wikia/ember-fandom/services/fetch';
import config from '../config/environment';

export default fetch.extend({
  init() {
    this.config = {
      internalCache: config.APP.internalCache,
      servicesExternalHost: config.APP.servicesExternalHost,
      servicesInternalHost: config.APP.servicesInternalHost,
    };

    this._super(...arguments);
  },
});
