import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';
import RecentWikiActivityModel from '../models/recent-wiki-activity';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';
import RouteWithBodyClassNameMixin from '../mixins/route-with-body-class-name';

export default Ember.Route.extend(
	HeadTagsDynamicMixin,
	RouteWithBodyClassNameMixin,
	{
		bodyClassNames: ['show-global-footer'],

		revisionUpvotes: Ember.inject.service(),

		/**
		 * Returns a Promise object with a list
		 * of the last 50 changes on a wiki.
		 * @returns {Ember.RSVP.Promise}
		 */
		model() {
			return RecentWikiActivityModel.getRecentActivityList();
		},

		afterModel(recentActivity) {
			this._super(...arguments);

			recentActivity.recentChanges.forEach((item) => {
				this.get('revisionUpvotes').initUpvotes(item.revid, item.upvotes);
			});
		},

		/**
		 * Custom implementation of HeadTagsMixin::setDynamicHeadTags
		 * @param {Object} model, this is model object from route::afterModel() hook
		 * @returns {void}
		 */
		setDynamicHeadTags(model) {
			this._super(model, {robots: 'noindex,follow'});
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
	}
);
