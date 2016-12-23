import Ember from 'ember';
import DiscussionContributor from './contributor';

const DiscussionUserActivityPostsUser = Ember.Object.extend({
	totalCount: null,
	userInfo: null,
	rank: null
});

DiscussionUserActivityPostsUser.reopenClass({
	create(postsData) {
		return this._super({
			totalCount: postsData.totalCount,
			userInfo: DiscussionContributor.create(postsData.userInfo),
			rank: postsData.rank
		});
	}
});

export default DiscussionUserActivityPostsUser;
