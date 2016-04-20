import Ember from 'ember';
import request from 'ember-ajax/request';

const defaultProps = 'user|userid|useravatar|parsedcomment|timestamp|title|ids|sizes|upvotes',
	RecentWikiActivityModel = Ember.Object.extend({
		init() {
			this._super(...arguments);
			this.recentChanges = {};
		}
	});

RecentWikiActivityModel.reopenClass({
	/**
	 * Gets the last changes on a given wiki.
	 *
	 * @param {number} [limit=50] number of changes to fetch
	 * @param {string} [props=defaultProps]
	 *
	 * @returns {Ember.RSVP.Promise}
	 */
	getRecentActivityList(limit = 50, props = defaultProps) {
		return request(M.buildUrl({path: '/api.php'}), {
				data: {
					action: 'query',
					format: 'json',
					list: 'recentchanges',
					rcnamespace: '0',
					rctype: 'edit',
					rcprop: props,
					rclimit: limit
				}
			}).then((data) => {
				const model = RecentWikiActivityModel.create(),
					recentChanges = RecentWikiActivityModel.prepareData(data.query.recentchanges);

				model.set('recentChanges', recentChanges);
				return model;
			})
	},

	prepareData(recentChanges) {
		return recentChanges.map((recentChange) => {
			recentChange.timestamp = new Date(recentChange.timestamp).getTime() / 1000;
			recentChange.id = `${recentChange.revid}-${recentChange.old_revid}`;
			recentChange.anonymous = !Ember.isNone(recentChange.anon);
			recentChange.lengthChange = recentChange.newlen - recentChange.oldlen;
			return recentChange;
		});
	}
});

export default RecentWikiActivityModel;
