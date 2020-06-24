import { alias, not } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';
import { track, trackActions } from '../utils/track';

export default Controller.extend(WikiPageControllerMixin, {
  application: controller(),
  wikiPage: controller(),

  wikiVariables: service(),
  steamNews: service(),

  init() {
    this._super(...arguments);
    const ids = this.wikiVariables.steamIds;
    const news = this.steamNews.fetchNews(ids);

    console.log(news);
  },

  commentsPage: alias('application.commentsPage'),
  applicationWrapperVisible: not('application.fullPage'),

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
