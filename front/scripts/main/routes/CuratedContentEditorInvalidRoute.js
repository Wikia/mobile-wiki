App.CuratedContentEditorInvalidRoute = Em.Route.extend({
	/**
	 * When user tries to load invalid path under /main/edit/* we redirect to /main/edi
	 * @returns {void}
	 */
	beforeModel() {
		this.transitionTo('curatedContentEditor');
	}
});
