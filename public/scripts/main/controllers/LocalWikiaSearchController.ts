/// <reference path="../app.ts" />
'use strict';

App.LocalWikiaSearchController = Em.Controller.extend({
	query: '',
	suggestions: [],
	search: Ember.observer('query', function () {
		debugger;
		if (!this.get('query')) {
			this.set('suggestions', []);
			return;
		}
		var uri = Wikia.article.wikiName + '.kenneth.wikia-dev.com/api/v1/Search/List?limit=25&minArticleQuality=10&namespaces=0,14&query=';
		uri += this.get('query');
		console.log('uri: ' + uri);
		Ember.$.getJSON(uri).then((data) => {
			debugger;
			this.set('suggestions', data.items);
		}, (reason) => {
			debugger;
			console.log('could not retrieve')
		});
		// .error(() => {
		// 	this.set('suggestions', [{
		// 		title: "No results"
		// 	}]);
		// });
	})
});
