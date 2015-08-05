/// <reference path="../app.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
/// <reference path="../mixins/LanguagesMixin.ts" />


'use strict';

App.WikiaInYourLangComponent = Em.Component.extend(App.AlertNotificationsMixin, App.LanguagesMixin, {
	classNames: ['wikia-in-your-lang'],

	didInsertElement: function () {
		this.handleWikiaInYourLang();
	},

	handleWikiaInYourLang: function (): void {
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

	createAlert: function (model: typeof App.WikiaInYourLangModel): void {
		var alertData = {
			message: model.message,
			expiry: 60000,
			unsafe: true,
			callbacks: {
				onInsertElement: function (alert: any): void {
					alert.on('click', 'a:not(.close)', (event: any) => {
						M.track({
							action: M.trackActions.click,
							category: 'wikiaInYourLangAlert',
							label: 'link'
						});
					});
				},
				onCloseAlert: function (): void {
					window.localStorage.setItem(this.getAlertKey(), new Date().getTime().toString());
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

	shouldShowWikiaInYourLang: function (): boolean {
		var value = window.localStorage.getItem(this.getAlertKey()),
		    now = new Date().getTime(),
		    notDismissed = !value || (now - value > 86400000), //1 day 86400000
		    isJaOnNonJaWikia = this.get('isJapaneseBrowser') && !this.get('isJapaneseWikia');
		return notDismissed && isJaOnNonJaWikia;
	},

	getAlertKey: function (): string {
		return 'wikiaInYourLang.alertDismissed';
	}
});
