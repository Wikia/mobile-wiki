import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { DontLogMeError } from '@wikia/ember-fandom/utils/errors';

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

    if (
      this.fastboot.isFastBoot
      && this.wikiVariables.isEmptyDomainWithLanguageWikis
    ) {
      this.fastboot.get('response.headers').set(
        'location',
        `${this.wikiVariables.basePath}${this.wikiVariables.scriptPath}/language-wikis`,
      );
      this.fastboot.set('response.statusCode', 301);
      throw new DontLogMeError();
    }
  },
});
