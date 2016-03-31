import Ember from 'ember';
import {trackPageView} from 'common/utils/track';

export default Ember.Route.extend({
	postDeleteFullScreenOverlay: false,

	actions: {
		/**
		 * @returns {void}
		 */
		retry() {
			this.refresh();
		},

		/**
		 * @returns {boolean}
		 */
		didTransition() {
			this.controllerFor('application').set('noMargins', true);

			trackPageView();

			return true;
		},

		/**
		 * Handler for a rejected model (or a throw from within model)
		 *
		 * @param {Ember.Object} model
		 * @param {Ember.Transition} transition
		 *
		 * @returns {boolean}
		 */
		error(model, transition) {
			model.get('error').set('transition', transition);

			return true;
		}
	}
});
