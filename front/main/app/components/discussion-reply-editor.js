import Ember from 'ember';
import DiscussionEditorComponent from './discussion-editor';
import {trackActions} from '../utils/discussion-tracker';

export default DiscussionEditorComponent.extend({
	classNames: ['reply-editor'],
	pinnedClassName: 'pinned-bottom',

	placeholderText: 'editor.reply-editor-placeholder-text',
	submitText: 'editor.reply-action-button-label',
	labelText: 'editor.reply-editor-label',

	closeTrackingAction: trackActions.ReplyClose,
	contentTrackingAction: trackActions.ReplyContent,
	startTrackingAction: trackActions.ReplyStart,

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	initializeStickyState() {
		const scrollY = window.scrollY || window.pageYOffset;

		this.set('isSticky', window.innerHeight + scrollY < this.$().offset().top + this.$().height());

		Ember.$(window).on('scroll.editor', () => {
			this.onScroll();
		});
	},

	/**
	 * Indicates if the scroll position reached a point where editor should start sticking
	 * @returns {boolean}
	 */
	isStickyBreakpointHeight() {
		const $editorLabel = this.$('.editor-label'),
			scrollY = window.scrollY || window.pageYOffset;

		return window.innerHeight + scrollY - this.$('.editor-container').outerHeight() <
			$editorLabel.offset().top + $editorLabel.outerHeight();
	},

	/**
	 * Handle recalculation of placeholder size on resize
	 * @returns {void}
	 */
	viewportChangeObserver: Ember.observer('viewportDimensions.width', 'viewportDimensions.height',
		function () {
			Ember.$(window).off('scroll.editor');
			this.initializeStickyState();
		}
	),

	/**
	 * Perform animations and logic after reply creation
	 * @returns {void}
	 */
	handleNewReplyCreated: Ember.observer('replies.@each.isNew', function () {
		const newReplies = this.get('replies').filter((reply) => reply.get('isNew')),
			newReply = newReplies.get('firstObject');

		if (newReply) {
			this.handleNewItemCreated(newReply);

			Ember.run.later(this, () => {
				Ember.$('html, body').animate({
					scrollTop: Ember.$(document).height()
				});
			}, 2000);
		}
	}),

	/**
	 * Ultra hack for editor on iOS
	 * iOS is scrolling on textarea focus, changing it's size on focus prevent that
	 * @returns {void}
	 */
	handleIOSFocus() {
		if (this.isIOSBrowser()) {
			const $editorTextarea = $('.editor-textarea');

			$editorTextarea
				.css('height', '30px')
				.on('focus', () => {
					setTimeout(() => {
						$editorTextarea.css('height', '100%');
					}, 500);
				})
				.on('blur', () => {
					$editorTextarea.css('height', '30px');
				});
		}
	},

	/**
	 * Handle clicks - focus in textarea and activate editor
	 * @returns {void}
	 */
	click() {
		this._super();
		Ember.run.later(this, () => {
			this.initializeStickyState();
		}, 200);
	},
});
