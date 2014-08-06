/// <reference path="../app.ts" />
'use strict';

App.LocalWikiaSearchController = Em.Controller.extend({
	query: '',
	suggestions: [{ title: 'No Results' }],
	 // in ms
	debouceDuration: 250,

	/**
	 * @desc query observer which makes ajax request for search suggestions
	 * based on query
	 */
	searchUnDebounced: function () {
		var noResults,
			uri;

		noResults = [{
			title: 'No Results'
		}];

		if (!this.get('query')) {
			this.set('suggestions', noResults);
			return;
		}
		uri = '/api/v1/search/' + encodeURI(this.get('query'));
		console.log('uri: ' + uri);
		Ember.$.getJSON(uri).then((data) => {
			if (data.exception) {
				this.set('suggestions', noResults);
			} else{
				this.set('suggestions', data.items.map(function (elem) {
					elem.url = '/wiki/' + elem.url.substr(elem.url.lastIndexOf('/') + 1);
					return elem;
				}));
			}
		});
	},

	/**
	 * @desc debouncing wrapper for query observer
	 */
	search: Ember.observer('query', function () {
		Ember.run.debounce(this, this.searchUnDebounced, this.debouceDuration);
	})
});
