import Ember from 'ember';

const RecentWikiActivityModel = Ember.Object.extend({
	init() {
		this._super(...arguments);
		this.recentChanges = {};
	}
});

RecentWikiActivityModel.reopenClass({
	/**
	 * Gets the last 50 changes on a given wiki.
	 * @returns {Ember.RSVP.Promise}
	 */
	getRecentActivityList() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.getJSON(
				M.buildUrl({path: '/api.php'}),
				{
					action: 'query',
					format: 'json',
					list: 'recentchanges',
					rcnamespace: '0',
					rctype: 'edit|external|new',
					rcprop: 'user|userid|useravatar|parsedcomment|timestamp|title|ids',
					rclimit: '50'
				}
			).done((data) => {
				const model = RecentWikiActivityModel.create(),
					recentChanges = RecentWikiActivityModel.prepareTimestamps(data.query.recentchanges);

				model.set('recentChanges', recentChanges);

				resolve(model);
			}).fail((err) => reject(err));
		});
	},

	prepareTimestamps(recentChanges) {
		recentChanges.forEach((rc) => {
			rc.timestamp = new Date(rc.timestamp).getTime() / 1000;
		});

		return recentChanges;
	}
});

export default RecentWikiActivityModel;
