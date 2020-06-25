import Component from '@ember/component';
import WidgetScriptStateMixin from '../mixins/widget-script-state';
import RenderComponentMixin from '../mixins/render-component';
import {inject as service} from "@ember/service";

export default Component.extend(
  RenderComponentMixin,
  WidgetScriptStateMixin,
  {
    wikiVariables: service(),
    steamNews: service(),

    init() {
      this._super(...arguments);

      this.loadNews();
    },

    loadNews() {
      const ids = this.wikiVariables.steamIds;
      let news = this.steamNews.fetchNews(ids);
      console.log(news);
      this.set('news', news);
    },
  },
);
