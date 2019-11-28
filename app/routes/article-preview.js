import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { getOwner } from '@ember/application';
import ApplicationWrapperClassNamesMixin from '../mixins/application-wrapper-class-names';
import ArticlePreviewModel from '../models/article-preview';
import { disableCache } from '../utils/fastboot-caching';

/**
  * Important: This route won't work when running `ember fastboot`,
  * for details see `fastboot-server.js`
  * In order to enable this route you need to run `yarn build` and `yarn fastboot-server`
  */
export default Route.extend(
  ApplicationWrapperClassNamesMixin,
  {
    fastboot: service(),
    logger: service(),
    wikiVariables: service(),

    init() {
      this._super(...arguments);

      this.applicationWrapperClassNames = ['article-preview'];
    },

    model() {
      const shoebox = this.get('fastboot.shoebox');

      if (this.get('fastboot.isFastBoot')) {
        const requestBody = this.get('fastboot._fastbootInfo.request.body');

        const model = ArticlePreviewModel.create(getOwner(this).ownerInjection());

        disableCache(this.fastboot);

        return model.articleFromMarkup(
          requestBody.title,
          requestBody.wikitext,
          requestBody.CKmarkup,
        )
          .then((articleData) => {
            shoebox.put('articleData', articleData);
            return articleData;
          });
      }
      return shoebox.retrieve('articleData');
    },

    actions: {
      /**
    * @param {*} error
    * @param {EmberStates.Transition} transition
    * @returns {boolean}
    */
      error(error, transition) {
        this.logger.error('Article preview route error', error);

        if (transition) {
          transition.abort();
        }
      },

      /**
    * @returns {Boolean} returns true
    */
      didTransition() {
        this.controllerFor('application').set('fullPage', true);
        return true;
      },
    },
  },
);
