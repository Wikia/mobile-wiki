/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />

'use strict';

App.WikiaInYourLangModel = Em.Object.extend({
	message: null,
	nativeDomain: null
});

App.WikiaInYourLangModel.reopenClass({
	load: function(): Em.RSVP.Promise {
		var browserLang = navigator.language || navigator.browserLanguage;
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.getJSON(
				M.buildUrl({ path: '/wikia.php' }),
				{
					controller: 'WikiaInYourLangController',
					method: 'getNativeWikiaInfo',
					format: 'json',
					targetLanguage: browserLang
				},
				function(resp: any): void {
					var modelInstance: any = null;
					if (resp.success) {
						modelInstance = App.WikiaInYourLangModel.create({
							nativeDomain: resp.nativeDomain,
							message: resp.message
						});
					}
					resolve(modelInstance);
				}
			).fail(function(err: any): void {
				reject(err);
			});
		});
	}
});
