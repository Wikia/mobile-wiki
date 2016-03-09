import Ember from 'ember';
import {updateTrackedUrl, trackPageView} from 'common/utils/track';

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

			M.tracker.UniversalAnalytics.setDimension(19, null);
			updateTrackedUrl(window.location.href);
			trackPageView(null);

			return true;
		}
	}
});
