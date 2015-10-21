App.CuratedContentEditorSectionIndexRoute = Em.Route.extend({
	/**
	 * @returns {undefined}
	 */
		renderTemplate() {
		this.render('curated-content-editor-section', {
			controller: 'curatedContentEditor.section'
		});
	}
});
