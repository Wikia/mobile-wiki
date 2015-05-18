/// <reference path="../app.ts" />
'use strict';

App.MainPageModel = Em.Object.extend({
	featuredContent: null,
	curatedContet: null,
	trendingArticles: null,
	trendingVideos: null,

	init: () => {
		// Only curated content needs the special treatment
		this.set('curatedContent', App.CuratedContentModel.create(this.get('curatedContent')));
	}
});
