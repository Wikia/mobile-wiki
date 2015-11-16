import App from '../app';

App.CuratedContentEditorIndexRoute = Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor', {
			model: this.modelFor('curatedContentEditor')
		});
	}
});
