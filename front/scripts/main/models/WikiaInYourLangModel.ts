/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />

'use strict';

App.WikiaInYourLangModel = Em.Object.extend({
	exists: null,
	message: null,
	nativeDomain: null
});

App.WikiaInYourLangModel.reopenClass({
	check: function(): Em.RSVP.Promise {
		var browserLang = navigator.language || navigator.browserLanguage;
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax({
				url: M.buildUrl({ path: '/wikia.php' }),
				data: {
					controller: 'WikiaInYourLangController',
					method: 'getNativeWikiaInfo',
					format: 'json',
					targetLanguage: browserLang
				},
				dataType: 'json',
				success: (resp: any): void => {
					var modelInstance = App.WikiaInYourLangModel.create({
						exists: resp.success
					});
					if (modelInstance.exists) {
						modelInstance.nativeDomain = resp.nativeDomain;
						modelInstance.message = resp.message;
					}
					resolve(modelInstance);
				},
				error: (err): void => {
					reject(err);
				}
			});
		});
	}
});
