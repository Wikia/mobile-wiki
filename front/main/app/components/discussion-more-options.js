import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';

export default Ember.Component.extend({
	classNames: ['more-options'],
	tagName: 'ul',
	currentUser: Ember.inject.service(),
	popover: nearestParent('pop-over'),

	canDelete: Ember.computed('post.isDeleted', function () {
		return !this.get('post.isDeleted') && this.get('post.userData.permissions.canDelete');
	}),

	canUndelete: Ember.computed.and('post.isDeleted', 'post.userData.permissions.canUndelete'),

	canDeleteOrUndelete: Ember.computed.or('canDelete', 'canUndelete'),

	canReport: Ember.computed('currentUser.isAuthenticated', 'post.userData.hasReported', 'post.isDeleted', function () {
		return !this.get('post.userData.hasReported') &&
			this.get('currentUser.isAuthenticated') &&
			!this.get('post.isDeleted');
	}),

	canLock: Ember.computed('isLockable', 'post.isLocked', 'post.userData.permissions.canDelete', function () {
		// @ToDo use canLock for this -> SOC-2144
		return this.get('isLockable') && !this.get('post.isLocked') && this.get('post.userData.permissions.canDelete');
	}),

	canUnlock: Ember.computed.and('isLockable', 'post.isLocked', 'post.userData.permissions.canDelete'),

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
