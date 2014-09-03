/**
 * wikiaBaseline.js
 * @description Sets up baseline first load experience to mirror the main web client
 */
function resetWikiaBaseline () {
	var W = window.W;
	W.provide('_state.firstPage', true);
	W.provide('article.articleDetails.comments', {});
	W.provide('article.articleDetails.id', 0);
	W.provide('article.articleDetails.ns', {});
	W.provide('article.articleDetails.title', {});
	W.provide('article.relatedPages.items', []);
	W.provide('article.userDetails.items', []);
	W.provide('article.payload.media', []);
	W.provide('article.payload.mediaUsers', []);
	W.provide('article.payload.users', []);
	W.provide('article.payload.user', 0);
	W.provide('article.payload.categories', []);
	W.provide('ads.slots', []);
}

resetWikiaBaseline();
