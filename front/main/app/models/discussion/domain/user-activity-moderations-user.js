import Ember from 'ember';
import DiscussionContributor from './contributor';

const DiscussionUserActivityModerationsUser = Ember.Object.extend({
	actions: null,
	userInfo: null,
	rank: null
});

DiscussionUserActivityModerationsUser.reopenClass({
	create(postsData) {
		return this._super({
			actions: postsData.actions,
			userInfo: DiscussionContributor.create(postsData.userInfo),
			rank: postsData.rank
		});
	}
});

export default DiscussionUserActivityModerationsUser;
