import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	classNames: ['more-options'],
	tagName: 'ul',
	currentUser: Ember.inject.service(),
	popover: nearestParent('pop-over'),

	canDelete: Ember.computed('post.isDeleted', function () {
		return !this.get('post.isDeleted') && this.get('post.userData.permissions.canDelete');
	}),

	canEdit: Ember.computed('post.userData.permissions.canEdit', 'post.userData.permissions.canMove',
		'post.isRequesterBlocked', function () {
			return (this.get('post.userData.permissions.canEdit') || this.get('post.userData.permissions.canMove'))
				&& !this.get('post.isRequesterBlocked');
		}
	),

	canUndelete: Ember.computed.and('post.isDeleted', 'post.userData.permissions.canUndelete'),

	canDeleteOrUndelete: Ember.computed.or('canDelete', 'canUndelete'),


	canLock: Ember.computed('isLockable', 'post.isLocked', 'post.userData.permissions.canLock', function () {
		return this.get('isLockable') && !this.get('post.isLocked') && this.get('post.userData.permissions.canLock');
	}),

	canReport: Ember.computed('currentUser.isAuthenticated', 'post.userData.hasReported', 'post.isDeleted', function () {
		return !this.get('post.userData.hasReported') &&
			this.get('currentUser.isAuthenticated') && !this.get('post.isDeleted');
	}),

	canShare: Ember.computed('isShareable', 'post.isDeleted', function () {
		return this.get('isShareable') && !this.get('post.isDeleted');
	}),

	canUnlock: Ember.computed.and('isLockable', 'post.isLocked', 'post.userData.permissions.canUnlock'),

	showShareDialog() {
	},

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		track(trackActions.MorePostActions);
	},

	actions: {
		/**
		 * @param {Object} post
		 *
		 * @returns {void}
		 */
		delete(post) {
			this.get('delete')(post);
			this.get('popover').deactivate();
		},

		edit(post) {
			this.sendAction('openEditEditor', post);

			this.get('popover').deactivate();
		},

		/**
		 * @param {Object} post
		 *
		 * @returns {void}
		 */
		lock(post) {
			this.get('lock')(post);
			track(trackActions.PostLock);
			this.get('popover').deactivate();
		},

		/**
		 * @param {Object} post
		 *
		 * @returns {void}
		 */
		report(post) {
			this.get('report')(post);
			track(trackActions.Report);
			this.get('popover').deactivate();
		},

		share(post) {
			this.get('showShareDialog')();
			this.get('popover').deactivate();
		},

		/**
		 * @param {Object} post
		 *
		 * @returns {void}
		 */
		undelete(post) {
			this.get('undelete')(post);
			this.get('popover').deactivate();
		},

		/**
		 * @param {Object} post
		 *
		 * @returns {void}
		 */
		unlock(post) {
			this.get('unlock')(post);
			track(trackActions.PostUnlock);
			this.get('popover').deactivate();
		},
	}
});
