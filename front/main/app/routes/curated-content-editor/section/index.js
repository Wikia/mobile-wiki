import Ember from 'ember';

export default Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor/section', {
			controller: 'curatedContentEditor.section',
			into: 'application'
		});
	}
});
