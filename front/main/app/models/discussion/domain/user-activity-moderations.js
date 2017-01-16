import Ember from 'ember';
import DiscussionUserActivityModerationsUser from './user-activity-moderations-user';

const DiscussionUserActivityModerations = Ember.Object.extend({
	days: null,
	users: null
});

DiscussionUserActivityModerations.reopenClass({
	create(postsData) {
		return this._super({
			days: postsData.days,
			users: new Ember.A(postsData.users.map(user => DiscussionUserActivityModerationsUser.create(user)))
				.sortBy('rank')
		});
	}
});

export default DiscussionUserActivityModerations;
