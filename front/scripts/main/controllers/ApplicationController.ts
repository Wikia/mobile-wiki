/// <reference path="../app.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
'use strict';

App.ApplicationController = Em.Controller.extend(App.LoadingSpinnerMixin, {
	queryParams: [{noAds: 'noads'}],
	smartBannerVisible: false,
	sideNavCollapsed: true,
	noScroll: false,
	noAds: '',

	init: function () {
		this.setProperties({
			domain: Em.get(Mercury, 'wiki.dbName') || window.location.href.match(/^https?:\/\/(.*?)\./)[1],
			language: Em.get(Mercury, 'wiki.language'),
			mainPageTitle: Em.get(Mercury, 'wiki.mainPageTitle'),
			siteMessage: Em.get(Mercury, 'wiki.siteMessage'),
			siteName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia'),
			editorPreview: Em.get(Mercury, 'article.preview'),
			shareFeatureAvailable: Em.get(Mercury, 'wiki.language.content') === 'ja'
		});

		// This event is for tracking mobile sessions between Mercury and WikiaMobile
		M.track({
			action: M.trackActions.impression,
			category: 'app',
			label: 'load'
		});

		this._super();
	}
});
