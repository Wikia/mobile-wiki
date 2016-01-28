import Ember from 'ember';
import {updateTrackedUrl, trackPageView} from 'common/utils/track';
import UniversalAnalytics from 'common/modules/Trackers/UniversalAnalytics';

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
		 * @returns {void}
		 */
		goToAllDiscussions() {
			this.transitionTo('discussion.index');
		},

		/**
		 * @returns {boolean}
		 */
		didTransition() {
			this.controllerFor('application').set('noMargins', true);

			UniversalAnalytics.setDimension(19, null);
			updateTrackedUrl(window.location.href);
			trackPageView(null);

			return true;
		}
	}
});
