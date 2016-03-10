import Ember from 'ember';
import {checkPermissions} from 'common/utils/discussionPermissions';

export default Ember.Component.extend({
	classNames: ['more-options'],
	tagName: 'ul',
	currentUser: Ember.inject.service(),

	canDelete: Ember.computed('post.isDeleted', function () {
		return !this.get('post.isDeleted') && checkPermissions(this.get('post'), 'canDelete');
	}),

	canUndelete: Ember.computed('post.isDeleted', function () {
		return this.get('post.isDeleted') && checkPermissions(this.get('post'), 'canUndelete');
	}),

	canDeleteOrUndelete: Ember.computed.or('canDelete', 'canUndelete'),

	canReport: Ember.computed('currentUser.isAuthenticated', 'post._embedded.userData.@each.hasReported', function () {
		return this.get('post._embedded.userData.0.hasReported') !== true &&
			this.get('currentUser.isAuthenticated') === true;
	}),

	canLock: Ember.computed('post.isEditable', 'post.canDelete', function () {
		// 'canDelete' until we have 'canLock' coming from the service
		return this.get('isLockable') && !this.get('post.isLocked') && checkPermissions(this.get('post'), 'canDelete');
	}),

	canUnlock: Ember.computed('post.isEditable', 'post.canDelete', function () {
		// 'canUndelete' until we have 'canUnlock' coming from the service
		return this.get('isLockable') && this.get('post.isLocked') && checkPermissions(this.get('post'), 'canUndelete');
	}),
});
