import Ember from 'ember';

const RecentWikiActivityModel = Ember.Object.extend({
	recentChanges: {}
});

RecentWikiActivityModel.reopenClass({
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
				resolve(RecentWikiActivityModel.create({recentChanges: data.query.recentchanges}));
			}).fail((err) => {
				reject(err);
			});
		});
	}
});

export default RecentWikiActivityModel;
