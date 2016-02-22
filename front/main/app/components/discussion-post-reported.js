import Ember from 'ember';
import {checkPermissions} from 'common/utils/discussionPermissions';

export default Ember.Component.extend({
	classNames: ['reported'],

	canDelete: Ember.computed(function () {
		return checkPermissions(this.get('post'), 'canModerate') && checkPermissions(this.get('post'), 'canDelete');
	}),

	canModerate: Ember.computed(function () {
		return checkPermissions(this.get('post'), 'canModerate');
	}),

	modalDialogService: Ember.inject.service('modal-dialog'),

	actions: {
		/**
		 * Delete item - shows modal dialog first
		 * @param {object} item - post or reply
		 * @param {boolean} isReply - if this is a reply
		 * @returns {void}
		 */
		delete(item, isReply) {
			this.get('modalDialogService').display(
				i18n.t('main.modal-dialog-delete-text', {ns: 'discussion'}),
				i18n.t('main.modal-dialog-delete-header', {ns: 'discussion'}),
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
				i18n.t('main.modal-dialog-approve-text', {ns: 'discussion'}),
				i18n.t('main.modal-dialog-approve-header', {ns: 'discussion'}),
				i18n.t('main.modal-dialog-approve', {ns: 'discussion'}),
				(() => this.attrs.approve(item))
			);
		},
	}
});
