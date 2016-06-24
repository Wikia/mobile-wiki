import Ember from 'ember';

const DiscussionEntity = Ember.Object.extend({
	createdBy: null,
	id: null,
	isDeleted: null,
	isLocked: null,
	isNew: null,
	isReply: null,
	isReported: null,
	isRequesterBlocked: null,
	openGraph: null,
	rawContent: null,
	reportDetails: null,
	threadId: null,
	title: null,
	upvoteCount: null,
	userData: null,
});

export default DiscussionEntity;
