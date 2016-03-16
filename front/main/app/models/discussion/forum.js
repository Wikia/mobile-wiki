import Ember from 'ember';

const DiscussionForum = Ember.object.extend({
	contributors: null,
	count: null,
	forumId: null,
	pageNum: null,
	pivotId: null,
	posts: null,
});

export default DiscussionForum;
