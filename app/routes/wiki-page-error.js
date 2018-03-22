import Route from '@ember/routing/route';
import logEvent from '../modules/event-logger';
import {inject as service} from '@ember/service';

export default Route.extend(
	{
		fastboot: service(),
		/**
		 * @param {Ember.Controller} controller
		 * @param {EmberError} error
		 * @returns {void}
		 */
		renderTemplate(controller, error) {
			if (!this.get('fastboot.isFastBoot')) {
				logEvent('Wiki-page route error substate', error);
			}

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
