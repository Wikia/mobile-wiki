App.CuratedContentEditorInvalidRoute = Em.Route.extend({
	/**
	 * When user tries to load invalid path under /main/edit/* we redirect to /main/edit
	 *
	 * @returns {undefined}
	 */
	beforeModel() {
		this.transitionTo('curatedContentEditor');
	}
});
