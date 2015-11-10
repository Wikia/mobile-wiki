import Ember from 'ember';

const CuratedContentEditorIndexRoute = Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor', {
			model: this.modelFor('curatedContentEditor')
		});
	}
});

export default CuratedContentEditorIndexRoute;
