import Ember from 'ember';

const DiscussionUserData = Ember.object.extend({
	permission: null,
	hasReported: null,
	hasUpvoted: null,
});

export default DiscussionUserData;
