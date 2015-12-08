import App from '../app';

export default App.CuratedContentEditorSectionIndexRoute = Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor-section', {
			controller: 'curatedContentEditor.section'
		});
	}
});
