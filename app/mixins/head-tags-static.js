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
		const model = this.modelFor('application');

		if (!model) {
			return;
		}

		this.get('headData').setProperties({
			appleTouchIcon: model.wikiVariables.appleTouchIcon,
			favicon: model.wikiVariables.favicon,
			siteName: model.wikiVariables.siteName,
			themeColor: config.verticalColors[model.wikiVariables.vertical],
			gaUrl: config.tracking.ua.scriptUrl,
			noExternals,
			facebookAppId: config.facebook.appId,
			lazyCss: !this.get('fastboot.isFastBoot')
		});
	}
});
