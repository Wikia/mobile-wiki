import { alias, not } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';
import { track, trackActions } from '../utils/track';

export default Controller.extend(WikiPageControllerMixin, {
  application: controller(),
  wikiPage: controller(),

  wikiVariables: service(),

  commentsPage: alias('application.commentsPage'),
  applicationWrapperVisible: not('application.fullPage'),

  @action
  trackClick(category, label) {
    track({
      action: trackActions.click,
      category,
      label,
    });
  },
});
