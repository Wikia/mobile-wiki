import Ember from 'ember';
import DiscussionContributor from './contributor';

const DiscussionUserActivityReportsUser = Ember.Object.extend({
	actions: null,
	breakdown: Ember.Object.create({
		queued: null,
		verified: null,
		deleted: null
	}),
	userInfo: null,
	rank: null
});

DiscussionUserActivityReportsUser.reopenClass({
	create(postsData) {
		return this._super({
			actions: postsData.actions,
			breakdown: Ember.Object.create(postsData.breakdown),
			userInfo: DiscussionContributor.create(postsData.userInfo),
			rank: postsData.rank
		});
	}
});

export default DiscussionUserActivityReportsUser;
