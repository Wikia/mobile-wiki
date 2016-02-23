import Ember from 'ember';
import {checkPermissions} from 'common/utils/discussionPermissions';

export default Ember.Component.extend({
	classNames: ['top-note'],

	canDelete: Ember.computed(function () {
		return checkPermissions(this.get('post'), 'canModerate') && checkPermissions(this.get('post'), 'canDelete');
	}),

	canModerate: Ember.computed(function () {
		return checkPermissions(this.get('post'), 'canModerate');
	}),

	modalDialogService: Ember.inject.service('modal-dialog'),

	/**
	 * Computes text for the post-card note:
	 *
	 ** "reply reported to moderator"
	 ** "post reported to moderator"
	 ** "a reply to userName, reported to moderator"
	 ** "a reply to userName"
	 */
	text: Ember.computed('isReported', function () {
		if (this.get('isReported')) {
			if (this.get('showRepliedTo')) {

				// post is reported, is a reply and supposed to show reply-to info
				return i18n.t('main.reported-to-moderators-replied-to', {
					ns: 'discussion',
					userName: this.get('threadCreatorName')
				});
			} else if (!this.get('showRepliedTo') && this.get('isReply')) {

				// post is reported, is a reply, but NOT supposed to show reply-to info
				return i18n.t('main.reported-to-moderators-reply', {ns: 'discussion'});
			} else if (!this.get('isReply')) {

				// post is reported and is NOT a reply
				return i18n.t('main.reported-to-moderators', {ns: 'discussion'});
			}
		} else if (this.get('showRepliedTo')) {

			// post is NOT reported, is a reply and supposed to show reply-to info
			return i18n.t('main.user-replied-to', {ns: 'discussion', userName: this.get('threadCreatorName')});
		}
	}),

	actions: {
		/**
		 * Delete item - shows modal dialog first
		 * @param {object} item - post or reply
		 * @param {boolean} isReply - if this is a reply
		 * @returns {void}
		 */
		delete(item, isReply) {
			this.get('modalDialogService').display(
				i18n.t(`main.modal-dialog-delete${isReply ? '-reply' : ''}-text`, {ns: 'discussion'}),
				i18n.t(`main.modal-dialog-delete${isReply ? '-reply' : ''}-header`, {ns: 'discussion'}),
				i18n.t('main.modal-dialog-delete', {ns: 'discussion'}),
				(() => this.attrs.delete(item))
			);
		},

		/**
		 * Approve item - shows modal dialog first
		 * @param {object} item - post or reply
		 * @param {boolean} isReply - if this is a reply
		 * @returns {void}
		 */
		approve(item, isReply) {
			this.get('modalDialogService').display(
				i18n.t(`main.modal-dialog-approve${isReply ? '-reply' : ''}-text`, {ns: 'discussion'}),
				i18n.t(`main.modal-dialog-approve${isReply ? '-reply' : ''}-header`, {ns: 'discussion'}),
				i18n.t('main.modal-dialog-approve', {ns: 'discussion'}),
				(() => this.attrs.approve(item))
			);
		},
	}
});
