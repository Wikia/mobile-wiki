define('mobile-wiki/components/main-page', ['exports', 'mobile-wiki/mixins/ads'], function (exports, _ads) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    computed = Ember.computed,
	    inject = Ember.inject,
	    run = Ember.run;
	exports.default = Component.extend(_ads.default, {
		classNames: ['main-page-modules', 'main-page-body'],
		tagName: 'section',

		currentUser: inject.service(),
		wikiVariables: inject.service(),

		title: computed.reads('wikiVariables.siteName'),

		curatedContentToolButtonVisible: computed.and('currentUser.rights.curatedcontent'),

		actions: {
			/**
    * @param {string} lightboxType
    * @param {Object} lightboxData
    * @returns {void}
    */
			openLightbox: function openLightbox(lightboxType, lightboxData) {
				this.sendAction('openLightbox', lightboxType, lightboxData);
			},


			/**
    * @param {CuratedContentItem} item
    * @returns {void}
    */
			openCuratedContentItem: function openCuratedContentItem(item) {
				this.sendAction('openCuratedContentItem', item);
			}
		},

		/**
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			var _this = this;

			this._super.apply(this, arguments);

			run.scheduleOnce('afterRender', this, function () {
				_this.setupAdsContext(_this.get('adsContext'));
				_this.get('ads.module').onReady(function () {
					_this.injectMainPageAds();
				});
			});
		}
	});
});