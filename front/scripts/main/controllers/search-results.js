import App from '../app';

App.SearchResultsController = Ember.Controller.extend({
	queryParams: ['q'],
	q: null,
});

export default App.SearchResultsController;
