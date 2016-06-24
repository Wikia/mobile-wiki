import Ember from 'ember';
import wrapMeHelper from '../helpers/wrap-me';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	classNames: ['top-note'],

	canDelete: Ember.computed.readOnly('post.userData.permissions.canDelete'),
	canModerate: Ember.computed.readOnly('post.userData.permissions.canModerate'),
	showButtons: Ember.computed.and('canShowModButtons', 'isReported', 'canModerate'),
	modalDialog: Ember.inject.service(),

	isReportDetailsVisible: false,

	reportDetailsEntryPointClassName: 'reportDetailsOpener',

	/**
	 * Context for the i18n.t method for localization texts used in top note area
	 */
	topNoteTextContext: Ember.computed('post.reportDetails.count', function () {
		return {
			ns: 'discussion',
			reportedByNumberUsers: wrapMeHelper.compute([
				i18n.t('main.reported-by-number-users', {
					ns: 'discussion',
					count: this.get('post.reportDetails.count'),
				})
			], {
				tagName: 'a',
				className: this.get('reportDetailsEntryPointClassName'),
			}),
			count: this.get('post.reportDetails.count'),
			reporterUserName: wrapMeHelper.compute([
				Ember.Handlebars.Utils.escapeExpression(this.get('post.reportDetails.users.firstObject.name'))
			], {
				tagName: 'a',
				className: this.get('reportDetailsEntryPointClassName'),
			}),
			threadCreatorName: Ember.Handlebars.Utils.escapeExpression(this.get('threadCreatorName')),
		};
	}),

	/**
	 * Computes text for the post-card note
	 */
	topNoteText: Ember.computed('isReported', 'post.isLocked', 'post.reportDetails.count', function () {
		// this block prepares 'reported posts' texts for moderators (regular user should never have post.reportDetails)
		if (this.get('isReported') && this.get('canModerate') && this.get('post.reportDetails')) {
			if (this.get('showRepliedTo')) {

				// post is reported, is a reply and supposed to show reply-to info
				return i18n.t('main.reported-by-replied-to', this.get('topNoteTextContext'));
			} else if (!this.get('showRepliedTo') && this.get('isReply')) {

				// post is reported, is a reply, but NOT supposed to show reply-to info
				return i18n.t('main.reported-by-reply', this.get('topNoteTextContext'));
			} else if (!this.get('isReply')) {
				if (this.get('post.isLocked')) {
					return i18n.t('main.reported-by-and-locked', this.get('topNoteTextContext'));
				}
				// post is reported and is NOT a reply
				return i18n.t('main.reported-by', this.get('topNoteTextContext'));
			}
		} else if (this.get('isReported') && !this.get('canModerate')) {
		// this block prepares 'reported posts' texts for regular users
		// it have the same logic as above, but prepares text for regular users

			if (this.get('isReply')) {

				// post is reported, is a reply, but NOT supposed to show reply-to info
				return i18n.t('main.reported-to-moderators-reply', this.get('topNoteTextContext'));
			} else if (this.get('post.isLocked')) {

				// post is reported and locked
				return i18n.t('main.reported-to-moderators-and-locked', this.get('topNoteTextContext'));
			} else {

				// post is reported and is NOT a reply
				return i18n.t('main.reported-to-moderators', this.get('topNoteTextContext'));
			}
		} else if (this.get('showRepliedTo')) {
			// post is NOT reported, is a reply and supposed to show reply-to info
			return i18n.t('main.user-replied-to', this.get('topNoteTextContext'));
		} else if (this.get('post.isLocked')) {
			return i18n.t('main.locked-post-text', this.get('topNoteTextContext'));
		}
	}),

	/**
	 * We want to trigger the action (report-details-modal open) only when the specific part of text is clicked/tapped.
	 * That part of text is wrapped in <span> element and contains class defined in 'reportDetailsEntryPointClassName'
	 * property.
	 * @param {Object} event - event object
	 * @returns {void}
	 */

	click(event) {
		if (event.target.classList.contains(this.get('reportDetailsEntryPointClassName'))) {
			this.set('isReportDetailsVisible', true);
			track(trackActions.ReportDetailsModalOpen);
		}
	},

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

		reportDetailsClose() {
			this.set('isReportDetailsVisible', false);
		},
	}
});
