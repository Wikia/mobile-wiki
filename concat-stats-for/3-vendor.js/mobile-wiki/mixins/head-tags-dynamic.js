define('mobile-wiki/mixins/head-tags-dynamic', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create({
		headData: service(),
		wikiVariables: service(),
		fastboot: service(),

		/**
   * @param {Object} model
   * @param {Ember.Transition} transition
   * @returns {void}
   */
		afterModel: function afterModel(model, transition) {
			var _this = this;

			this._super.apply(this, arguments);

			transition.then(function () {
				_this.setDynamicHeadTags(model);
			});
		},


		/**
   * This function updates dynamic tags defined in templates/head.hbs
   * This is for head tags which could be changed on different routes
   *
   * @param {Object} model, this is model object from route::afterModel() hook,
   * it should be used ONLY in custom implementation of this function
   * @param {Object} [data={}], object where you can pass data from custom implementation of this function
   * @returns {void}
   */
		setDynamicHeadTags: function setDynamicHeadTags(model) {
			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var htmlTitleSettings = this.get('wikiVariables.htmlTitle'),
			    wikiHtmlTitle = htmlTitleSettings.parts.join(htmlTitleSettings.separator),
			    headData = {
				htmlTitle: wikiHtmlTitle,
				description: data.description,
				canonical: data.canonical,
				next: data.next,
				prev: data.prev,
				appId: this.get('wikiVariables.smartBanner.appId.ios'),
				robots: this.get('wikiVariables.specialRobotPolicy') || data.robots || 'index,follow',
				keywords: '' + this.get('wikiVariables.siteMessage') + (',' + this.get('wikiVariables.siteName')) + (',' + this.get('wikiVariables.dbName')),
				appleItunesApp: '',
				amphtml: data.amphtml
			};

			if (data.htmlTitle) {
				headData.htmlTitle = data.htmlTitle + htmlTitleSettings.separator + wikiHtmlTitle;
				headData.keywords += ',' + data.htmlTitle;
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

			if (!this.get('fastboot.isFastBoot') && headData.appId && !this.get('wikiVariables.enableFandomAppSmartBanner')) {
				headData.appleItunesApp = 'app-id=' + headData.appId;

				if (data.appArgument) {
					headData.appleItunesApp += ', app-argument=' + data.appArgument;
				}
			}

			this.get('headData').setProperties(headData);
		}
	});
});