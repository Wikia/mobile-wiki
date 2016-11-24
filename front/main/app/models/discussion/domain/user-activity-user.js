import Ember from 'ember';
import DiscussionContributor from './contributor';

const DiscussionUserActivityUser = Ember.Object.extend({
	postCount: null,
	userInfo: null,
	rank: null
});

DiscussionUserActivityUser.reopenClass({
	create(postsData) {
		return this._super({
			postCount: postsData.postCount,
			userInfo: DiscussionContributor.create(postsData.userInfo),
			rank: postsData.rank
		});
	}
});

export default DiscussionUserActivityUser;
