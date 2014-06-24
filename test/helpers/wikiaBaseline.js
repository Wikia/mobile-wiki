/**
 * startWikiaBaseline.js
 * @description Sets up baseline first load experience to mirror the main web client
 */
function resetWikiaBaseline () {
	var Wikia = window.Wikia;
	Wikia.provide('_state.firstPage', true);
	Wikia.provide('article.articleDetails.comments', {});
	Wikia.provide('article.articleDetails.id', 0);
	Wikia.provide('article.articleDetails.ns', {});
	Wikia.provide('article.articleDetails.title', {});
	Wikia.provide('article.relatedPages.items', []);
	Wikia.provide('article.userDetails.items', []);
	Wikia.provide('article.payload.media', []);
	Wikia.provide('article.payload.mediaUsers', []);
	Wikia.provide('article.payload.users', []);
	Wikia.provide('article.payload.user', 0);
	Wikia.provide('article.payload.categories', []);
};

resetWikiaBaseline();
