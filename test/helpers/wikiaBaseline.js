/**
 * wikiaBaseline.js
 * @description Sets up baseline first load experience to mirror the main web client
 */

function resetWikiaBaseline () {
	var W = window.W;
	W.provide('_state.firstPage', true);
	W.provide('article.details', {
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
	W.provide('article.relatedPages.items', []);
	W.provide('article.userDetails.items', []);
	W.provide('article.article.media', []);
	W.provide('article.article.mediaUsers', []);
	W.provide('article.article.users', []);
	W.provide('article.article.user', 0);
	W.provide('article.article.categories', []);
	W.provide('ads.slots', []);
	W.provide('wiki', {
		siteName: 'Test Site'
	});
}

resetWikiaBaseline();
