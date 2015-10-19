App.CuratedContentEditorIndexRoute = Em.Route.extend({
	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor', {
			model: this.modelFor('curatedContentEditor')
		});
	}
});
