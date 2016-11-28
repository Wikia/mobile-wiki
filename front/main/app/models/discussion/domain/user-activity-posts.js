import Ember from 'ember';
import DiscussionUserActivityUser from './user-activity-user';

const DiscussionUserActivityPosts = Ember.Object.extend({
	days: null,
	users: null
});

DiscussionUserActivityPosts.reopenClass({
	create(postsData) {
		return this._super({
			days: postsData.days,
			users: new Ember.A(postsData.users.map(user => DiscussionUserActivityUser.create(user)))
				.sortBy('rank')
		});
	}
});

export default DiscussionUserActivityPosts;
