import {
  alias, and, equal, not,
} from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';
import { track, trackActions } from '../utils/track';

export default Controller.extend(WikiPageControllerMixin, {
  application: controller(),
  wikiPage: controller(),

  wikiVariables: service(),

  commentsPage: alias('application.commentsPage'),
  loadExternals: not('application.noExternals'),
  isContLangEn: equal('wikiVariables.language.content', 'en'),
  applicationWrapperVisible: not('application.fullPage'),
  displayRecirculation: and('isContLangEn', 'loadExternals', 'applicationWrapperVisible'),

  actions: {
    trackClick(category, label) {
      track({
        action: trackActions.click,
        category,
        label,
      });
    },
  },
});
