/// <reference path="../app.ts" />
'use strict';

App.DiscussionReplyEditorComponent = App.DiscussionEditorComponent.extend({
	classNames: ['reply-editor'],
	pinnedClassName: 'pinned-bottom',

	placeholderText: 'editor.reply-editor-placeholder-text',
	submitText: 'editor.reply-action-button-label',
	labelText: 'editor.reply-editor-label',

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	initializeStickyState(): void {
		if (window.innerHeight < this.$().offset().top + this.$().height()) {
			this.set('isSticky', true);
		} else {
			this.set('isSticky', false);
		}
	},

	/**
	 * Handle recalculation of placeholder size on resize
	 * @returns {void}
	 */
	viewportChangeObserver: Em.observer('viewportDimensions.width', 'viewportDimensions.height',
		function (): void {
			this.initializeStickyState();
		}
	),

	/**
	 * Perform animations and logic after reply creation
	 * @returns {void}
	 */
	handleNewReplyCreated: Em.observer('replies.@each.isNew', function (): void {
		var newReplies = this.get('replies').filter(function (reply: any): boolean {
				return reply.isNew;
			}),
			newReply = newReplies.get('firstObject');

		if (newReply) {
			Em.$('html, body').animate({scrollTop: Em.$(document).height()});
			this.handleNewItemCreated(newReply);
		}
	}),

	/**
	 * Handle clicks - focus in textarea and activate editor
	 * @returns {void}
	 */
	click(): void {
		this._super();
		Em.run.later(this, (): void => {
			this.initializeStickyState();
		}, 200);
	}
});
