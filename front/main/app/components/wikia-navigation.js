import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	globalNavContent: 'side-nav-global-navigation-root',

	actions: {
		/**
		 * @returns {void}
		 */
		collapse() {
			this.set('globalNavContent', 'side-nav-global-navigation-root');
			this.sendAction('toggleVisibility', false);
		},

		/**
		 * @returns {void}
		 */
		loadRandomArticle() {
			this.set('globalNavContent', 'side-nav-global-navigation-root');
			this.sendAction('loadRandomArticle');
		},

		replaceNavigationContent(navName) {
			if (navName === 'explore') {
				this.set('globalNavContent', 'side-nav-explore-wikia-navigation');
			} else if (navName === 'local') {
				this.set('globalNavContent', 'side-nav-local-navigation-root');
			} else if (navName === 'root') {
				this.set('globalNavContent', 'side-nav-global-navigation-root');
			}
		}
	}
});
