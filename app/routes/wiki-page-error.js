import Ember from 'ember';
import RouteWithBodyClassNameMixin from '../mixins/route-with-body-class-name';

export default Ember.Route.extend(
	RouteWithBodyClassNameMixin,
	{
		bodyClassNames: ['show-global-footer'],

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
		},

		actions: {
			/**
			 * @returns {void}
			 */
			reloadPage() {
				location.reload();
			}
		}
	}
);
