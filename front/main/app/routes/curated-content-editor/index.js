import Ember from 'ember';

export default Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor/index', {
			model: this.modelFor('curatedContentEditor')
		});
	}
});
