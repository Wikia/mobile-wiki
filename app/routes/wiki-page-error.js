import Ember from 'ember';
import RouteWithBodyClassNameMixin from '../mixins/route-with-body-class-name';

const {Route} = Ember;

export default Route.extend(
	RouteWithBodyClassNameMixin,
	{
		bodyClassNames: ['show-global-footer'],

		/**
		 * @param {Ember.Controller} controller
		 * @param {EmberError} error
		 * @returns {void}
		 */
		renderTemplate(controller, error) {
			switch (error.code) {
				case 404:
					this.render('errors/not-found');
					break;
				default:
					this.render('errors/other');
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
