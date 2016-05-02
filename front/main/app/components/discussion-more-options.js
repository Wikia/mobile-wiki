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

	canUndelete: Ember.computed.and('post.isDeleted', 'post.userData.permissions.canUndelete'),

	canDeleteOrUndelete: Ember.computed.or('canDelete', 'canUndelete'),

	canReport: Ember.computed('currentUser.isAuthenticated', 'post.userData.hasReported', 'post.isDeleted', function () {
		return !this.get('post.userData.hasReported') &&
			this.get('currentUser.isAuthenticated') &&
			!this.get('post.isDeleted');
	}),

	canLock: Ember.computed('isLockable', 'post.isLocked', 'post.userData.permissions.canLock', function () {
		return this.get('isLockable') && !this.get('post.isLocked') && this.get('post.userData.permissions.canLock');
	}),

	canUnlock: Ember.computed.and('isLockable', 'post.isLocked', 'post.userData.permissions.canUnlock'),

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		track(trackActions.MorePostActions);
	},

	actions: {
		/**
		 * @param {object} post
		 *
		 * @returns {void}
		 */
		lock(post) {
			this.attrs.lock(post);
			track(trackActions.PostLock);
			this.get('popover').deactivate();
		},

		/**
		 * @param {object} post
		 *
		 * @returns {void}
		 */
		unlock(post) {
			this.attrs.unlock(post);
			track(trackActions.PostUnlock);
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
			track(trackActions.Report);
			this.get('popover').deactivate();
		},
	}
});
