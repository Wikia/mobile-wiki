/// <reference path="../app.ts" />
'use strict';

/**
 * @desc Controller for the search results. Note that the actual search bar is
 * contained in SideNav, so this is a child of that controller and that
 * controller modifies LocalWikiaSearchController#query at will. This controller
 * is simply made to respond to changes to that property, and update so that its
 * view can display the results of the search.
 */
App.LocalWikiaSearchController = Em.Controller.extend({
	query: '',
	suggestions: [],
	// Message to display if suggestions is empty
	showEmptyMessage: false,
	// in ms
	debouceDuration: 250,

	/**
	 * @desc query observer which makes ajax request for search suggestions
	 * based on query
	 */
	searchWithoutDebounce: function () {
		var uri;

		uri = '/api/v1/search/' + encodeURI(this.get('query'));

		Ember.$.getJSON(uri).then((data) => {
			if (data.exception) {
				this.set('suggestions', []);
				this.set('showEmptyMessage', true)
			} else {
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
