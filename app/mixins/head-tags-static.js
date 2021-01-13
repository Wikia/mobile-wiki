import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import config from '../config/environment';
import { isDarkTheme, isMobileApp } from '../utils/mobile-app';

export default Mixin.create({
  headData: service(),
  fastboot: service(),

  /**
  * @returns {void}
  */
  afterModel(resolvedModel, transition) {
    this._super(...arguments);

    this.setStaticHeadTags(transition.queryParams.noexternals);
  },

  /**
  * This function sets static head tags defined in templates/head.hbs
  * This is for head tags which are set only once
  *
  * @returns {void}
  */
  setStaticHeadTags(noExternals) {
    const model = this.modelFor('application');

    const isInDarkTheme = isDarkTheme(this.fastboot);
    const isInMobileApp = isMobileApp(this.fastboot);

    if (!model) {
      return;
    }

    let isExperiment = false;
    if (this.fastboot.isFastBoot) {
      const requestHeaders = this.get('fastboot.request.headers');
      const experimentHeader = requestHeaders.get('X-Experiment');
      isExperiment = experimentHeader === 'true'
    }

    this.headData.setProperties({
      appleTouchIcon: model.wikiVariables.appleTouchIcon,
      cdnRootUrl: model.wikiVariables.cdnRootUrl,
      favicon: model.wikiVariables.favicon,
      siteName: model.wikiVariables.siteName,
      gaUrl: config.APP.tracking.ua.scriptUrl,
      noExternals,
      facebookAppId: config.APP.facebook.appId,
      lazyCss: !this.get('fastboot.isFastBoot'),
      shouldLoadDarkCss: isInMobileApp && isInDarkTheme,
      twitterSite: model.wikiVariables.twitterAccount || '@getfandom',
      isExperiment,
    });
  },
});
