define('mobile-wiki/mixins/head-tags-static', ['exports', 'mobile-wiki/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create({
		headData: service(),
		fastboot: service(),

		/**
   * @returns {void}
   */
		afterModel: function afterModel(resolvedModel, transition) {
			this._super.apply(this, arguments);

			this.setStaticHeadTags(transition.queryParams.noexternals);
		},


		/**
   * This function sets static head tags defined in templates/head.hbs
   * This is for head tags which are set only once
   *
   * @returns {void}
   */
		setStaticHeadTags: function setStaticHeadTags(noExternals) {
			var wikiVariables = this.modelFor('application');

			if (!wikiVariables) {
				return;
			}

			this.get('headData').setProperties({
				appleTouchIcon: wikiVariables.appleTouchIcon,
				favicon: wikiVariables.favicon,
				siteName: wikiVariables.siteName,
				themeColor: _environment.default.verticalColors[wikiVariables.vertical],
				gaUrl: _environment.default.tracking.ua.scriptUrl,
				noExternals: noExternals,
				facebookAppId: _environment.default.facebook.appId
			});
		}
	});
});