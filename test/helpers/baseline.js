/**
 * baseline.js
 * @description Sets up baseline first load experience to mirror the main web client
 */

function resetMercuryBaseline () {
	var M = window.M;
	// initalize firstPage to true, allow mutation
	M.prop('firstPage', true, true);
	M.prop('apiBase', '/api/v1', true);
	M.prop('weppyConfig', {
		host: '',
		samplingRate: 1,
		aggregationInterval: 1000
	}, true);
	M.provide('article.details', {
		abstract: 'Test abstract',
		comments: 99,
		id: 123,
		ns: 0,
		original_dimensions: {},
		revision: {},
		thumbnail: '',
		title: 'Test',
		type: 'article',
		url: '/wiki/Test'
	});
	M.provide('article.relatedPages.items', []);
	M.provide('article.userDetails.items', []);
	M.provide('article.article.media', []);
	M.provide('article.article.mediaUsers', []);
	M.provide('article.article.users', []);
	M.provide('article.article.user', 0);
	M.provide('article.article.categories', []);
	M.provide('ads.slots', []);
	M.provide('wiki', {
		siteName: 'Test Site',
		language: {
			content: 'en'
		}
	});

	var dimensions = [];
	dimensions[8] = 'test/article';
	Mercury.Modules.Trackers.UniversalAnalytics.setDimensions(dimensions);
}

resetMercuryBaseline();
