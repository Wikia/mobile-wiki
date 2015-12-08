import App from '../app';

export default App.CuratedContentEditorIndexRoute = Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor', {
			model: this.modelFor('curatedContentEditor')
		});
	}
});
