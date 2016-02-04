import Ember from 'ember';
import MetaTagsMixin from '../mixins/meta-tags';
import RecentWikiActivityModel from '../models/recent-wiki-activity';

export default Ember.Route.extend(MetaTagsMixin, {

	/**
	 * @returns {Object}
	 */
	meta() {
		return {
			name: {
				robots: 'noindex, follow'
			}
		};
	},

	/**
	 * Makes sure that the RWA is enabled only on one wiki for now.
	 */
	beforeModel(transition) {
		// Enable the RWA for kirkburn.wikia.com only
		if (Ember.get(Mercury, 'wiki.id') !== 41727) {
			transition.abort();
			this.transitionTo('mainPage');
		}
	},

	/**
	 * Returns a Promise object with a list
	 * of the last 50 changes on a wiki.
	 * @returns {Ember.RSVP.Promise}
	 */
	model() {
		return RecentWikiActivityModel.getRecentActivityList();
	}
});
