import Ember from 'ember';

const DiscussionUserList = Ember.Object.extend({
	contributors: null,
	count: null,
	forumId: null,
	items: null,
	pageNum: null,
	pivotId: null,
	username: null,
});

export default DiscussionUserList;
