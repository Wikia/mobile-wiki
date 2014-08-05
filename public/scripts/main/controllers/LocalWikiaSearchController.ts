/// <reference path="../app.ts" />
'use strict';

App.LocalWikiaSearchController = Em.Controller.extend({
	needs: ['application'],
	query: '',
	suggestions: [],
	search: Ember.observer('query', function () {
		if (!this.get('query')) {
			this.set('suggestions', []);
			return;
		}
		var uri = '/api/v1/search/' + encodeURI(this.get('query'));
		console.log('uri: ' + uri);
		Ember.$.getJSON(uri).then((data) => {
			this.set('suggestions', data.items);
			console.log(this.get('suggestions'));
		}, (reason) => {
			console.log('could not retrieve')
		});
		// .error(() => {
		// 	this.set('suggestions', [{
		// 		title: "No results"
		// 	}]);
		// });
	})
});
