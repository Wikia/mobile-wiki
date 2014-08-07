/// <reference path="../app.ts" />
'use strict';

App.LocalWikiaSearchController = Em.Controller.extend({
	query: '',
	suggestions: [],
	// Message to display if suggestions is empty
	emptyMessage: '',
	 // in ms
	debouceDuration: 250,

	/**
	 * @desc query observer which makes ajax request for search suggestions
	 * based on query
	 */
	searchWithoutDebounce: function () {
		var uri;

		uri = '/api/v1/search/' + encodeURI(this.get('query'));
		console.log('uri: ' + uri);
		Ember.$.getJSON(uri).then((data) => {
			if (data.exception) {
				this.set('suggestions', []);
				this.set('emptyMessage', 'No Results')
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
		this.set('suggestions', []);
		if (this.get('query')) {
			this.set('emptyMessage', 'Loading...');
			Ember.run.debounce(this, this.searchWithoutDebounce, this.debouceDuration);
		} else {
			this.set('emptyMessage', '');
		}
	})
});
