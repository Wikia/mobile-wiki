import AlertNotificationsMixin from '../mixins/alert-notifications';
import LanguagesMixin from '../mixins/languages';
import WikiaInYourLangModel from '../models/wikia-in-your-lang';
import {track, trackActions} from '../../mercury/utils/track';

export default Ember.Component.extend(
	AlertNotificationsMixin,
	LanguagesMixin,
	{
		alertKey: 'wikiaInYourLang.alertDismissed',

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this.handleWikiaInYourLang();
		},

		/**
		 * @returns {void}
		 */
		handleWikiaInYourLang() {
			if (this.shouldShowWikiaInYourLang()) {
				WikiaInYourLangModel.load()
					.then((model) => {
						if (model) {
							this.createAlert(model);
							track({
								action: trackActions.impression,
								category: 'wikiaInYourLangAlert',
								label: 'shown',
							});
						}
					}, (err) => {
						track({
							action: trackActions.impression,
							category: 'wikiaInYourLangAlert',
							label: err || 'error',
						});
					});
			}
		},

		/**
		 * @param {WikiaInYourLangModel} model
		 * @returns {void}
		 */
		createAlert(model) {
			const alertData = {
				message: model.message,
				expiry: 60000,
				unsafe: true,
				callbacks: {
					onInsertElement: (alert) => {
						alert.on('click', 'a:not(.close)', () => {
							track({
								action: trackActions.click,
								category: 'wikiaInYourLangAlert',
								label: 'link',
							});
						});
					},
					onCloseAlert: () => {
						window.localStorage.setItem(this.get('alertKey'), new Date().getTime().toString());
						track({
							action: trackActions.click,
							category: 'wikiaInYourLangAlert',
							label: 'close',
						});
					},
				},
			};

			this.addAlert(alertData);
		},

		/**
		 * @returns {boolean}
		 */
		shouldShowWikiaInYourLang() {
			const value = window.localStorage.getItem(this.get('alertKey')),
				now = new Date().getTime(),
				/**
				 * 2,592,000,000 = 30 days
				 */
				notDismissed = !value || (now - value > 2592000000),
				notSameLanguage = isUserLangDifferentFromWikiLang();

			return notDismissed && notSameLanguage;
		},

		/**
		 * @return {integer}
		 */
		 isUserLangDifferentFromWikiLang() {
			const userLang = this.getBrowserLanguage(),
				eligibleCountries = ['zh', 'ko', 'vi', 'ru', 'ja'];
			let isDifferent = false;

			if (eligibleCountries.indexOf(userLang) !== -1) {
				isDifferent = userLang !== Ember.get(Mercury, 'wiki.language.content');
			}
			return isDifferent;
		 }
	}
);
