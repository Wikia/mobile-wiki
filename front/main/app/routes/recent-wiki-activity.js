import Ember from 'ember';
import MetaTagsMixin from '../mixins/meta-tags';
import RecentWikiActivityModel from '../models/recent-wiki-activity';

export default Ember.Route.extend(MetaTagsMixin, {

	/**
	 * @returns {{name: {robots: string}}}
	 */
	meta() {
		return {
			name: {
				robots: 'noindex, follow'
			}
		};
	},

	/**
	 * Make sure that RWA is enabled only for one wiki.
	 * @param {EmberState.Transition} transition
	 * @return {void}
	 */
	beforeModel() {
		const enabled = [41727, 1306324];

		// Enable the RWA for kirkburn.wikia.com and aga.wikia.com only
		if (enabled.indexOf(Ember.get(Mercury, 'wiki.id')) < 0) {
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
