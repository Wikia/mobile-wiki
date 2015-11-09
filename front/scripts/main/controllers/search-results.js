import Ember from 'ember';

const SearchResultsController = Ember.Controller.extend({
	queryParams: ['q'],
	q: null,
});

export default SearchResultsController;
