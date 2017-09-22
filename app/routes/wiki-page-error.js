import Ember from 'ember';

const {Route} = Ember;

export default Route.extend(
	{
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
				window.location.reload();
			}
		}
	}
);
