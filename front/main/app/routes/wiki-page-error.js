import Ember from 'ember';

export default Ember.Route.extend({

	/**
	 * @param {Ember.Controller} controller
	 * @param {Ember.Model} model
	 * @returns {void}
	 */
	renderTemplate(controller, model) {
		switch (model.code) {
			case 404:
				this.render('error-pages/error-404');
				break;
			default:
				this.render('error-pages/other-errors');
				break;
		}
	}
});
