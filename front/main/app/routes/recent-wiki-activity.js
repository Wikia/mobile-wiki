import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';
import MetaTagsMixin from '../mixins/meta-tags';
import RecentWikiActivityModel from '../models/recent-wiki-activity';

export default Ember.Route.extend(MetaTagsMixin, {
	revisionUpvotes: Ember.inject.service(),

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
	 * Returns a Promise object with a list
	 * of the last 50 changes on a wiki.
	 * @returns {Ember.RSVP.Promise}
	 */
	model() {
		return RecentWikiActivityModel.getRecentActivityList();
	},

	afterModel(recentActivity) {
		recentActivity.recentChanges.forEach((item) => {
			this.get('revisionUpvotes').initUpvotes(item.revid, item.upvotes);
		});
	},

	actions: {
		/**
		 * @returns {boolean}
		 */
		didTransition() {
			track({
				action: trackActions.impression,
				category: 'app',
				label: 'recent-wiki-activity'
			});
			return true;
		},

		willTransition(transition) {
			if (transition.targetName === 'articleDiff') {
				const diff = transition.params.articleDiff,
					id = `${diff.newId}-${diff.oldId}`,
					query = `?rc=${id}`;

				this.controllerFor('articleDiff').set('currRecentChangeId', id);

				// TODO: let's rethink this approach to preserve scroll position state
				window.history.replaceState({}, null, query);
			}
		}
	}
});
