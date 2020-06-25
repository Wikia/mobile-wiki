import Component from '@ember/component';
import WidgetScriptStateMixin from '../mixins/widget-script-state';
import RenderComponentMixin from '../mixins/render-component';
import {inject as service} from "@ember/service";
import fetch from "fetch";

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

      this.steamNews.fetchNews(ids)
        .then(news => this.set('news', news));
    },
  },
);
