define('mobile-wiki/components/category-members-grouped', ['exports', 'mobile-wiki/mixins/alert-notifications', 'mobile-wiki/utils/track'], function (exports, _alertNotifications, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Component = Ember.Component;
	var $ = Ember.$;
	var run = Ember.run;
	exports.default = Component.extend(_alertNotifications.default, {
		i18n: service(),
		logger: service(),
		classNames: ['category-members-grouped'],
		classNameBindings: ['isLoading'],
		isLoading: false,

		actions: {
			/**
    * @param {number} page
    * @param {string} label
    */
			loadPage: function loadPage(page, label) {
				var _this = this;

				this.set('isLoading', true);

				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'category-page',
					label: 'load-' + label
				});

				this.get('loadPage')(page).then(function () {
					var navHeight = $('.site-head').outerHeight() + $('.site-head-fandom-bar').outerHeight(),
					    scrollTop = _this.$().offset().top - navHeight;

					run.scheduleOnce('afterRender', _this, function () {
						$('html, body').animate({ scrollTop: scrollTop });
					});
				}).catch(function (error) {
					_this.addAlert({
						message: _this.get('i18n').t('category-page.load-error'),
						type: 'alert'
					});

					_this.get('logger').error(error);
				}).finally(function () {
					_this.set('isLoading', false);
				});
			},


			/**
    * @param {string} category
    * @param {string} label
    */
			trackClick: function trackClick(category, label) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: category,
					label: label
				});
			}
		}
	});
});