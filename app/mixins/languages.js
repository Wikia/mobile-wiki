import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { dasherize } from '@ember/string';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  wikiVariables: service(),
  defaultLanguage: 'en',

  /**
  * Returns navigator language with fallback to a default language
  * defined at the top of this object
  * @returns {string}
  */
  getBrowserLanguage() {
    let lang = navigator.language || navigator.browserLanguage;

    if (!lang) {
      return this.defaultLanguage;
    }

    lang = dasherize(lang);

    // pt-br is the only one supported share-feature language with dash and 5 characters
    if (lang !== 'pt-br') {
      lang = lang.split('-')[0];
    }

    return lang;
  },
});
