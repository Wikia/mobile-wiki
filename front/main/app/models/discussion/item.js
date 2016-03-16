import Ember from 'ember';


const DiscussionItem = Ember.Object.extend({
	createdBy: null,
	id: null,
	isDeleted: null,
	isLocked: null,
	isReported: null,
	isRequesterBlocked: null,
	rawContent: null,
	threadId: null,
	title: null,
	upvoteCount: null
	userData: null,
});

export default DiscussionItem;
