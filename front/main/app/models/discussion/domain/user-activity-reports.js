import Ember from 'ember';
import DiscussionUserActivityReportsUser from './user-activity-reports-user';

const DiscussionUserActivityReports = Ember.Object.extend({
	days: null,
	users: null
});

DiscussionUserActivityReports.reopenClass({
	create(postsData) {
		return this._super({
			days: postsData.days,
			users: new Ember.A(postsData.users.map(user => DiscussionUserActivityReportsUser.create(user)))
				.sortBy('rank')
		});
	}
});

export default DiscussionUserActivityReports;
