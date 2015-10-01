/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/LanguagesMixin.ts" />


'use strict';

App.WikiaInYourLangComponent = Em.Component.extend(App.AlertNotificationsMixin, App.LanguagesMixin, {
	alertKey: 'wikiaInYourLang.alertDismissed',

	didInsertElement(): void {
		this.handleWikiaInYourLang();
	},

	handleWikiaInYourLang(): void {
		if (this.shouldShowWikiaInYourLang()) {
			App.WikiaInYourLangModel.load()
				.then((model: typeof App.WikiaInYourLangModel): void  => {
					if (model) {
						this.createAlert(model);
						M.track({
							action: M.trackActions.impression,
							category: 'wikiaInYourLangAlert',
							label: 'shown'
						});
					}
				}, (err: any) => {
					M.track({
						action: M.trackActions.impression,
						category: 'wikiaInYourLangAlert',
						label: err || 'error'
					});
				});
		}
	},

	createAlert(model: typeof App.WikiaInYourLangModel): void {
		var alertData = {
			message: model.message,
			expiry: 60000,
			unsafe: true,
			callbacks: {
				onInsertElement: (alert: any): void => {
					alert.on('click', 'a:not(.close)', (event: any) => {
						M.track({
							action: M.trackActions.click,
							category: 'wikiaInYourLangAlert',
							label: 'link'
						});
					});
				},
				onCloseAlert: (): void => {
					window.localStorage.setItem(this.get('alertKey'), new Date().getTime().toString());
					M.track({
						action: M.trackActions.click,
						category: 'wikiaInYourLangAlert',
						label: 'close'
					});
				}
			}
		};
		this.addAlert(alertData);
	},

	shouldShowWikiaInYourLang(): boolean {
		var value = window.localStorage.getItem(this.get('alertKey')),
		    now = new Date().getTime(),
		    notDismissed = !value || (now - value > 2592000000), //30 day 2,592,000,000
		    isJaOnNonJaWikia = this.get('isJapaneseBrowser') && !this.get('isJapaneseWikia');
		return notDismissed && isJaOnNonJaWikia;
	}
});
