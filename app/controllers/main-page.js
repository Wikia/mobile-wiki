import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';

export default Controller.extend(WikiPageControllerMixin, {
  application: controller(),
  steamNews: service(),
  wikiVariables: service(),

  init() {
    const ids = [];
    this.model.steamNews = this.steamNews.load(ids);
  },
});
