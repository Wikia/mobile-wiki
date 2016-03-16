import Ember from 'ember';

const DiscussionUserPermissions = Ember.object.extend({
	canDelete: null,
	canLock: null,
	canModerate: null,
	canUndelete: null,
	canUnlock: null,
});

export default DiscussionUserPermissions;
