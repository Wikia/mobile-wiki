import App from '../app';

App.CuratedContentEditorInvalidRoute = Ember.Route.extend({
	/**
	 * When user tries to load invalid path under /main/edit/* we redirect to /main/edit
	 *
	 * @returns {void}
	 */
	beforeModel() {
		this.transitionTo('curatedContentEditor');
	}
});

export default App.CuratedContentEditorInvalidRoute;
