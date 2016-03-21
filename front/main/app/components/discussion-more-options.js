import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';
import {checkPermissions} from 'common/utils/discussion-permissions';

export default Ember.Component.extend({
	classNames: ['more-options'],
	tagName: 'ul',
	currentUser: Ember.inject.service(),
	popover: nearestParent('pop-over'),

	canDelete: Ember.computed('post.isDeleted', function () {
		return !this.get('post.isDeleted') && this.get('post.userData.permissions.canDelete');
	}),

	canUndelete: Ember.computed('post.isDeleted', function () {
		return this.get('post.isDeleted') && this.get('post.userData.permissions.canUndelete');
	}),

	canDeleteOrUndelete: Ember.computed.or('canDelete', 'canUndelete'),

	canReport: Ember.computed('currentUser.isAuthenticated', 'post.userData.hasReported', function () {
		return this.get('post.userData.hasReported') !== true &&
			this.get('currentUser.isAuthenticated') === true;
	}),

	canLock: Ember.computed('post.isEditable', 'post.canDelete', function () {
		// @ToDo use canLock for this -> SOC-2144
		return this.get('isLockable') && !this.get('post.isLocked') && this.get('post.userData.permissions.canDelete');
	}),

	canUnlock: Ember.computed('post.isEditable', 'post.canDelete', function () {
		// @ToDo use canLock for this -> SOC-2144
		return this.get('isLockable') && this.get('post.isLocked') && this.get('post.userData.permissions.canUndelete');
	}),

	actions: {
		/**
		 * @param {object} post
		 *
		 * @returns {void}
		 */
		lock(post) {
			this.attrs.lock(post);
			this.get('popover').deactivate();
		},

		/**
		 * @param {object} post
		 *
		 * @returns {void}
		 */
		unlock(post) {
			this.attrs.unlock(post);
			this.get('popover').deactivate();
		},

		/**
		 * @param {object} post
		 *
		 * @returns {void}
		 */
		delete(post) {
			this.attrs.delete(post);
			this.get('popover').deactivate();
		},

		/**
		 * @param {object} post
		 *
		 * @returns {void}
		 */
		undelete(post) {
			this.attrs.undelete(post);
			this.get('popover').deactivate();
		},

		/**
		 * @param {object} post
		 *
		 * @returns {void}
		 */
		report(post) {
			this.attrs.report(post);
			this.get('popover').deactivate();
		},
	}
});
