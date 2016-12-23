import Ember from 'ember';
import DiscussionContributor from './contributor';

const DiscussionUserActivityModerationsUser = Ember.Object.extend({
	userInfo: null,
	rank: null,
	totalCount: 0,
});

DiscussionUserActivityModerationsUser.reopenClass({
	create(postsData) {
		return this._super({
			userInfo: DiscussionContributor.create(postsData.userInfo),
			rank: postsData.rank,
			totalCount: postsData.totalCount
		});
	}
});

export default DiscussionUserActivityModerationsUser;
