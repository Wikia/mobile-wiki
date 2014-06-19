/**
 * startWikiaBaseline.js
 * @description Sets up baseline first load experience to mirror the main web client
 */
(function () {
	var Wikia = window.Wikia;
	Wikia.provide('_state.firstPage', true);
	Wikia.provide('article.articleDetails.comments', {});
	Wikia.provide('article.articleDetails.id', 0);
	Wikia.provide('article.articleDetails.ns', {});
	Wikia.provide('article.articleDetails.title', {});
	Wikia.provide('article.relatedPages.items', []);
	Wikia.provide('article.userDetails.items', []);
}());
