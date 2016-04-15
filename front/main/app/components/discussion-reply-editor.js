import Ember from 'ember';
import DiscussionEditorComponent from './discussion-editor';

export default DiscussionEditorComponent.extend({
	editorBottomSpacing: null,

	classNames: ['reply-editor'],
	pinnedClassName: 'pinned-bottom',

	placeholderText: 'editor.reply-editor-placeholder-text',
	submitText: Ember.computed('isEdit', function () {
		if (this.get('isEdit')) {
			return 'editor.reply-edit-action-button-label';
		} else {
			return 'editor.reply-action-button-label';
		}
	}),
	labelText: Ember.computed('isEdit', function () {
		if (this.get('isEdit')) {
			return 'editor.reply-edit-editor-label';
		} else {
			return 'editor.reply-editor-label';
		}
	}),

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	initializeStickyState() {
		const isSticky = window.innerHeight < this.$().offset().top + this.$().height();

		this.set('isSticky', isSticky);

		Ember.$(window).on('scroll.editor', () => {
			this.onScroll();
		});
	},

	/**
	 * Indicates if the scroll position reached a point where editor should start sticking
	 * @returns {boolean}
	 */
	isStickyBreakpointHeight() {
		let editorContainer;

		if (!this.get('editorBottomSpacing')) {
			editorContainer = Ember.$('.editor-container');
			this.set('editorBottomSpacing', parseInt(editorContainer.css('borderBottomWidth'), 10) +
				parseInt(editorContainer.css('margin-bottom'), 10));
		}

		return Ember.$('.reply-editor')
				.get(0).getBoundingClientRect().bottom - window.innerHeight >= this.get('editorBottomSpacing');
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
		const newReplies = this.get('replies').filter((reply) => reply.isNew),
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
	}
});
