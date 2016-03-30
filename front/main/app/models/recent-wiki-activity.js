import Ember from 'ember';

const defaultProps = 'user|userid|useravatar|parsedcomment|timestamp|title|ids|sizes',
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
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.getJSON(
				M.buildUrl({path: '/api.php'}),
				{
					action: 'query',
					format: 'json',
					list: 'recentchanges',
					rcnamespace: '0',
					rctype: 'edit',
					rcprop: props,
					rclimit: limit
				}
			).done((data) => {
				const model = RecentWikiActivityModel.create(),
					recentChanges = RecentWikiActivityModel.prepareData(data.query.recentchanges);

				model.set('recentChanges', recentChanges);
				resolve(model);
			}).fail((err) => reject(err));
		});
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
