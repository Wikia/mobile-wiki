/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />

'use strict';

App.WikiaInYourLangModel = Em.Object.extend({
	message: null,
	nativeDomain: null
});

App.WikiaInYourLangModel.reopenClass({
	load(): Em.RSVP.Promise {
		var browserLang = navigator.language || navigator.browserLanguage,
		    model = App.WikiaInYourLangModel.getFromCache(browserLang); //read from cache

		if (model) {
			return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
				resolve(model);
			});
		}
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
					window.localStorage.setItem(
						App.WikiaInYourLangModel.getCacheKey(browserLang),
						JSON.stringify({ model: modelInstance, timestamp: new Date().getTime() })
					); //write to cache
					resolve(modelInstance);
				}
			).fail(function(err: any): void {
				reject(err);
			});
		});
	},

	getFromCache(browserLang: string): typeof App.WikiaInYourLangModel {
		var key = App.WikiaInYourLangModel.getCacheKey(browserLang),
		    value = JSON.parse(window.localStorage.getItem(key)),
		    now = new Date().getTime();
		if (!value || now - value.timestamp > 2592000000) { //we cache 30 days (2592000000)
			return null;
		}
		return value.model;
	},

	getCacheKey(lang: string): string {
		return lang + '-WikiaInYourLang';
	}
});
