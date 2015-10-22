App.CuratedContentEditorIndexRoute = Em.Route.extend({
	/**
	 * @returns {undefined}
	 */
	renderTemplate() {
		this.render('curated-content-editor', {
			model: this.modelFor('curatedContentEditor')
		});
	}
});
