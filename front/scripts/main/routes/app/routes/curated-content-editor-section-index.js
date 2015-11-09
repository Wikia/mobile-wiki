App.CuratedContentEditorSectionIndexRoute = Em.Route.extend({
	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor-section', {
			controller: 'curatedContentEditor.section'
		});
	}
});
