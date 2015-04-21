/// <reference path="../app.ts" />
'use strict';

App.ApplicationController = Em.Controller.extend({
	queryParams: [{noAds: 'noads'}],
	smartBannerVisible: false,
	sideNavCollapsed: true,
	noScroll: false,
	noAds: '',
	isLoading: false,
	spinnerDelay: 300,
	spinnerTimeout: null,
	fullPage: false,

	init: function () {
		this.setProperties({
			domain: Em.get(Mercury, 'wiki.dbName') || window.location.href.match(/^https?:\/\/(.*?)\./)[1],
			language: Em.get(Mercury, 'wiki.language'),
			mainPageTitle: Em.get(Mercury, 'wiki.mainPageTitle'),
			siteMessage: Em.get(Mercury, 'wiki.siteMessage'),
			siteName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia'),
			editorPreview: Em.get(Mercury, 'article.preview')
		});

		// This event is for tracking mobile sessions between Mercury and WikiaMobile
		M.track({
			action: M.trackActions.impression,
			category: 'app',
			label: 'load'
		});

		this._super();
	},

	/**
	 * show loader with some small delay
	 * if we are able to load it under the delay
	 * perceived speed of applications is better
	 * if not, small delay will be almost unnoticeable
	 */
	showLoader: function () {
		this.set('spinnerTimeout', Em.run.later(this, (): void => {
			this.set('isLoading', true);
		}, this.spinnerDelay));
	},

	hideLoader: function () {
		Em.run.cancel(this.get('spinnerTimeout'));
		this.set('isLoading', false);
	}
});
