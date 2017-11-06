define('mobile-wiki/components/wikia-in-your-lang', ['exports', 'mobile-wiki/mixins/alert-notifications', 'mobile-wiki/mixins/languages', 'mobile-wiki/models/wikia-in-your-lang', 'mobile-wiki/utils/local-storage-connector', 'mobile-wiki/utils/track'], function (exports, _alertNotifications, _languages, _wikiaInYourLang, _localStorageConnector, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Component = Ember.Component;
	var getOwner = Ember.getOwner;
	exports.default = Component.extend(_alertNotifications.default, _languages.default, {
		wikiVariables: service(),
		alertKey: 'wikiaInYourLang.alertDismissed',

		/**
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			this.handleWikiaInYourLang();
		},


		/**
   * @returns {void}
   */
		handleWikiaInYourLang: function handleWikiaInYourLang() {
			var _this = this;

			if (this.shouldShowWikiaInYourLang()) {
				_wikiaInYourLang.default.create(getOwner(this).ownerInjection()).load().then(function (modelData) {
					if (modelData) {
						_this.createAlert(modelData);
						(0, _track.track)({
							action: _track.trackActions.impression,
							category: 'wikiaInYourLangAlert',
							label: 'shown'
						});
					}
				}, function (err) {
					(0, _track.track)({
						action: _track.trackActions.impression,
						category: 'wikiaInYourLangAlert',
						label: err || 'error'
					});
				});
			}
		},


		/**
   * @param {object} modelData
   * @returns {void}
   */
		createAlert: function createAlert(modelData) {
			var _this2 = this;

			var alertData = {
				message: modelData.message,
				expiry: 60000,
				unsafe: true,
				callbacks: {
					onInsertElement: function onInsertElement(alert) {
						alert.on('click', 'a:not(.close)', function () {
							(0, _track.track)({
								action: _track.trackActions.click,
								category: 'wikiaInYourLangAlert',
								label: 'link'
							});
						});
					},
					onCloseAlert: function onCloseAlert() {
						_localStorageConnector.default.setItem(_this2.get('alertKey'), new Date().getTime().toString());
						(0, _track.track)({
							action: _track.trackActions.click,
							category: 'wikiaInYourLangAlert',
							label: 'close'
						});
					}
				}
			};

			this.addAlert(alertData);
		},


		/**
   * @returns {boolean}
   */
		shouldShowWikiaInYourLang: function shouldShowWikiaInYourLang() {
			var value = _localStorageConnector.default.getItem(this.get('alertKey')),
			    now = new Date().getTime(),

			/**
    * 2,592,000,000 = 30 days
    */
			notDismissed = !value || now - value > 2592000000,
			    notSameLanguage = this.isUserLangDifferentFromWikiLang();

			return notDismissed && notSameLanguage;
		},


		/**
   * @return {boolean}
   */
		isUserLangDifferentFromWikiLang: function isUserLangDifferentFromWikiLang() {
			var userLang = this.getBrowserLanguage(),
			    eligibleCountries = ['zh', 'ko', 'vi', 'ru', 'ja'];
			var isDifferent = false;

			if (eligibleCountries.indexOf(userLang) !== -1) {
				isDifferent = userLang !== this.get('wikiVariables.language.content');
			}

			return isDifferent;
		}
	});
});