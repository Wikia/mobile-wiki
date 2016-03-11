import Ember from 'ember';
import {checkPermissions} from 'common/utils/discussionPermissions';
import nearestParent from 'ember-pop-over/computed/nearest-parent';

export default Ember.Component.extend({
	classNames: ['more-options'],
	tagName: 'ul',
	currentUser: Ember.inject.service(),
	popover: nearestParent('pop-over'),

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
		// @ToDo use canLock for this -> SOC-2144
		return this.get('isLockable') && !this.get('post.isLocked') && checkPermissions(this.get('post'), 'canDelete');
	}),

	canUnlock: Ember.computed('post.isEditable', 'post.canDelete', function () {
		// @ToDo use canLock for this -> SOC-2144
		return this.get('isLockable') && this.get('post.isLocked') && checkPermissions(this.get('post'), 'canUndelete');
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
