import Ember from 'ember';
import DiscussionContributor from './contributor';

const DiscussionUserActivityReportsUser = Ember.Object.extend({
	totalCount: 0,
	actionBreakdown: Ember.Object.create({
		queued: null,
		validated: null,
		deleted: null
	}),
	userInfo: null,
	rank: null
});

DiscussionUserActivityReportsUser.reopenClass({
	create(postsData) {
		return this._super({
			totalCount: postsData.totalCount,
			actionBreakdown: Ember.Object.create(postsData.actionBreakdown),
			userInfo: DiscussionContributor.create(postsData.userInfo),
			rank: postsData.rank
		});
	}
});

export default DiscussionUserActivityReportsUser;
