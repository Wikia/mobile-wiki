import App from '../app';
import DiscussionEditorComponent from './discussion-editor';

export default App.DiscussionReplyEditorComponent = DiscussionEditorComponent.extend({
	editorBottomSpacing: null,

	classNames: ['reply-editor'],
	pinnedClassName: 'pinned-bottom',

	placeholderText: 'editor.reply-editor-placeholder-text',
	submitText: 'editor.reply-action-button-label',
	labelText: 'editor.reply-editor-label',

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	initializeStickyState() {
		if (window.innerHeight < this.$().offset().top + this.$().height()) {
			this.set('isSticky', true);
		} else {
			this.set('isSticky', false);
		}

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
		const newReplies = this.get('replies').filter((reply) => {
				return reply.isNew;
			}),
			newReply = newReplies.get('firstObject');

		if (newReply) {
			Ember.$('html, body').animate({
				scrollTop: Ember.$(document).height()
			});
			this.handleNewItemCreated(newReply);
		}
	}),

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
