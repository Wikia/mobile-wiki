import Ember from 'ember';
import wrapMeHelper from '../helpers/wrap-me';

export default Ember.Component.extend({
	classNames: ['top-note'],

	canDelete: Ember.computed.readOnly('post.userData.permissions.canDelete'),
	canModerate: Ember.computed.readOnly('post.userData.permissions.canModerate'),
	showButtons: Ember.computed.and('canShowModButtons', 'isReported', 'canModerate'),
	modalDialog: Ember.inject.service(),

	isReportDetailsVisible: false,

	repotDetailsEntryPointClassName: 'repotDetailsOpener',

	/**
	 * Computes text for the post-card note:
	 *
	 ** "reply reported to moderator"
	 ** "post reported to moderator"
	 ** "a reply to userName, reported to moderator"
	 ** "a reply to userName"
	 */
	text: Ember.computed('isReported', 'post.isLocked', 'post.reportDetails.count', function () {
		const templateTextsContext = {
			ns: 'discussion',
			countUsers: wrapMeHelper.compute([
				i18n.t('main.reported-by-number-users', {
					ns: 'discussion',
					count: this.get('post.reportDetails.count'),
				})
			], {
				tagName: 'a',
				className: this.get('repotDetailsEntryPointClassName'),
			}),
			count: parseInt(this.get('post.reportDetails.count'), 10),
			reporterUserName: wrapMeHelper.compute([this.get('post.reportDetails.users.firstObject.name')], {
				tagName: 'a',
				className: this.get('repotDetailsEntryPointClassName'),
			}),
			threadCreatorName: Ember.Handlebars.SafeString(this.get('threadCreatorName')),
		};

		if (this.get('isReported') && this.get('post.reportDetails')) {
			if (this.get('showRepliedTo')) {

				// post is reported, is a reply and supposed to show reply-to info
				return i18n.t('main.reported-by-replied-to', templateTextsContext);
			} else if (!this.get('showRepliedTo') && this.get('isReply')) {

				// post is reported, is a reply, but NOT supposed to show reply-to info
				return i18n.t('main.reported-by-reply', templateTextsContext);
			} else if (!this.get('isReply')) {
				if (this.get('post.isLocked')) {
					return i18n.t('main.reported-by-and-locked', templateTextsContext);
				}
				// post is reported and is NOT a reply
				return i18n.t('main.reported-by', templateTextsContext);
			}
		} else if (this.get('showRepliedTo')) {
			// post is NOT reported, is a reply and supposed to show reply-to info
			return i18n.t('main.user-replied-to', templateTextsContext);
		} else if (this.get('post.isLocked')) {
			return i18n.t('main.locked-post-text', {ns: 'discussion'});
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
			let message,
				header;

			if (isReply) {
				message = i18n.t(`main.modal-dialog-delete-reply-text`, {ns: 'discussion'});
				header = i18n.t(`main.modal-dialog-delete-reply-header`, {ns: 'discussion'});
			} else {
				message = i18n.t(`main.modal-dialog-delete-text`, {ns: 'discussion'});
				header = i18n.t(`main.modal-dialog-delete-header`, {ns: 'discussion'});
			}

			this.get('modalDialog').display(
				message,
				header,
				i18n.t('main.modal-dialog-delete', {ns: 'discussion'}),
				(() => this.get('delete')(item))
			);
		},

		/**
		 * Approve item - shows modal dialog first
		 * @param {object} item - post or reply
		 * @param {boolean} isReply - if this is a reply
		 * @returns {void}
		 */
		approve(item, isReply) {
			let message,
				header;

			if (isReply) {
				message = i18n.t(`main.modal-dialog-approve-reply-text`, {ns: 'discussion'});
				header = i18n.t(`main.modal-dialog-approve-reply-header`, {ns: 'discussion'});
			} else {
				message = i18n.t(`main.modal-dialog-approve-text`, {ns: 'discussion'});
				header = i18n.t(`main.modal-dialog-approve-header`, {ns: 'discussion'});
			}

			this.get('modalDialog').display(
				message,
				header,
				i18n.t('main.modal-dialog-approve', {ns: 'discussion'}),
				(() => this.get('approve')(item))
			);
		},

		/**
		 * @param {String} item - post or reply
		 * @param {boolean} isReply - if this is a reply
		 * @returns {void}
		 */
		showReportDetails(postId) {
			this.set('isReportDetailsVisible',
				event.target.classList.contains(this.get('repotDetailsEntryPointClassName'))
			);
		},

		reportDetailsClose() {
			this.set('isReportDetailsVisible', false);
		},
	}
});
