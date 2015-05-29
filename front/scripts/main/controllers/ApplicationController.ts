/// <reference path="../app.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
'use strict';

App.ApplicationController = Em.Controller.extend(App.LoadingSpinnerMixin, App.AlertNotificationsMixin, {
	queryParams: ['file', 'map', {
		commentsPage: 'comments_page',
		noAds: 'noads'
	}],
	commentsPage: null,
	file: null,
	map: null,
	noAds: '',

	smartBannerVisible: false,
	sideNavCollapsed: true,
	noScroll: false,
	fullPage: false,
	lightboxType: null,
	lightboxModel: null,

	lightboxQueryParams: Em.computed(function (): any[] {
		return this.getProperties('file', 'map');
	}),

	init: function () {
		this.setProperties({
			domain: Em.get(Mercury, 'wiki.dbName') || window.location.href.match(/^https?:\/\/(.*?)\./)[1],
			language: Em.get(Mercury, 'wiki.language'),
			editorPreview: Em.get(Mercury, 'article.preview')
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
