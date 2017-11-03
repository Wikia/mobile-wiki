import {inject as service} from '@ember/service';
import Mixin from '@ember/object/mixin';
import config from '../config/environment';

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
		const wikiVariables = this.modelFor('application');

		if (!wikiVariables) {
			return;
		}

		this.get('headData').setProperties({
			appleTouchIcon: wikiVariables.appleTouchIcon,
			favicon: wikiVariables.favicon,
			siteName: wikiVariables.siteName,
			themeColor: config.verticalColors[wikiVariables.vertical],
			gaUrl: config.tracking.ua.scriptUrl,
			noExternals,
			facebookAppId: config.facebook.appId
		});
	}
});
