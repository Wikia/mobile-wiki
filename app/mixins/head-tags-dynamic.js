import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import truncate from '../utils/truncate';
import config from '../config/environment';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  headData: service(),
  wikiVariables: service(),
  fastboot: service(),

  /**
  * @param {Object} model
  * @param {Ember.Transition} transition
  * @returns {void}
  */
  afterModel(model, transition) {
    this._super(...arguments);

    transition.then(() => {
      this.setDynamicHeadTags(model);
    });
  },

  /**
  * This function updates dynamic tags defined in templates/head.hbs
  * This is for head tags which could be changed on different routes
  *
  * @param {Object} model, this is model object from route::afterModel() hook,
  * it should be used ONLY in custom implementation of this function
  * @param {Object} [data={}],
  * object where you can pass data from custom implementation of this function
  * @returns {void}
  */
  setDynamicHeadTags(model, data = {}) {
    const htmlTitleSettings = this.get('wikiVariables.htmlTitle');
    const wikiHtmlTitle = htmlTitleSettings.parts.join(htmlTitleSettings.separator);
    const headData = {
      htmlTitle: wikiHtmlTitle,
      description: data.description,
      canonical: data.canonical,
      next: data.next,
      prev: data.prev,
      robots: this.get('wikiVariables.specialRobotPolicy') || data.robots || 'index,follow',
      keywords: `${this.get('wikiVariables.siteMessage')}`
   + `,${this.get('wikiVariables.siteName')}`
   + `,${this.get('wikiVariables.dbName')}`,
      appleItunesApp: '',
      amphtml: data.amphtml,
      isDedicatedForArticle: false,
    };

    if (config.environment === 'production') {
      headData.robots = data.robots || this.get('wikiVariables.specialRobotPolicy') || 'index,follow';
    }

    if (data.htmlTitle) {
      headData.htmlTitle = data.htmlTitle + htmlTitleSettings.separator + wikiHtmlTitle;
      headData.keywords += `,${data.htmlTitle}`;
    }

    if (model.title) {
      headData.title = model.title;
    }

    if (model.type) {
      headData.type = model.type;
    }

    if (model.details && model.details.thumbnail) {
      headData.pageImage = model.details.thumbnail;
    }

    if (model.hreflangLinks) {
      headData.hreflangLinks = model.hreflangLinks;
    }

    if (model.featuredVideo && model.featuredVideo.isDedicatedForArticle) {
      headData.isDedicatedForArticle = true;
    }

    headData.twitterTitle = truncate(headData.htmlTitle, 70);
    headData.twitterDescription = truncate(data.description || headData.htmlTitle, 200);

    this.headData.setProperties(headData);
  },
});
