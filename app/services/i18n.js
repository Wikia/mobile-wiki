import i18n from '@wikia/ember-fandom/services/i18n';
import config from '../config/environment';

export default i18n.extend({
  init() {
    this.config = {
      translationsNamespaces: config.APP.translationsNamespaces,
      translationsPath: config.APP.translationsPath,
    };

    this._super(...arguments);
  },
});
