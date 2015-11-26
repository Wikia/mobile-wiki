import App from '../app';

export default App.SearchResultsController = Ember.Controller.extend({
	queryParams: ['q'],
	q: null,
});
