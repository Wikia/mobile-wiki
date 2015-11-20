/// <reference path="../app.ts" />
'use strict';

App.DiscussionReplyEditorComponent = App.DiscussionEditorComponent.extend({
	classNames: ['discussion-editor', 'reply-editor'],

	placeholderText: 'editor.reply-editor-placeholder-text',
	submitText: 'editor.reply-action-button-label',

	/**
	 * Set right height for editor placeholder when editor gets sticky
	 * @returns {void}
	 */
	style: Em.computed('isSticky', function (): string {
		return this.get('isSticky') === true
			? `height: ${this.$('.editor-container').outerHeight(true)}px`
			: null;
	}),

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	setStickyPositioning(): void {
		if (window.innerHeight < this.$().offset().top + this.$().height()) {
			this.set('isSticky', true);
		} else {
			this.set('isSticky', false);
		}
	},

	getBreakpointHeight(): number {
		return this.offsetTop - (this.get('siteHeadPinned') ? this.siteHeadHeight : 0);
	},

	/**
	 * @returns {void}
	 */
	didInsertElement(): void {
		this._super();

		this.setStickyPositioning();
	},

	/**
	 * Handle recalculation of placeholder size on resize
	 * @returns {void}
	 */
	viewportChangeObserver: Em.observer('viewportDimensions.width', function (): void {
		this.setStickyPositioning();
	}),

	onScroll(): void {},

	/**
	 * Handle post creation error
	 * @returns {void}
	 */
	errorObserver: Em.observer('shouldShowError', function (): void {
		if (this.get('shouldShowError')) {
			this.setProperties({
				isLoading: false,
				hasError: true
			});
		}
	}),

	/**
	 * Handle clicks - focus in textarea and activate editor
	 * @returns {void}
	 */
	click(): void {
		this.$('.editor-textarea').focus();
		Em.run.later(this, (): void => {
			this.setStickyPositioning();
		}, 200);
	},

	actions: {
		/**
		 * Enable/disable editor
		 * @returns {void}
		 */
		toggleEditorActive(active: boolean): void {
			this.set('isActive', active);
		},

		/**
		 * Send request to model to create new post and start animations
		 * @returns {void}
		 */
		create(forumId: string): void {
			this.set('isLoading', true);
			Em.$('html, body').animate({ scrollTop: 0 });

			this.sendAction('createReply', {
				body: this.$('.editor-textarea').val(),
				creatorId: this.get('currentUser.userId'),
				siteId: Mercury.wiki.id,
			});
		},

		/**
		 * Update editor when typing - activate editor and activate submit button
		 * @returns {void}
		 */
		updateOnInput(): void {
			this.setProperties({
				submitDisabled: this.$('.editor-textarea').val().length === 0,
				isActive: true
			});
		},

		/**
		 * Handle keypress - post creation shortcut
		 * @returns {void}
		 */
		handleKeyPress(forumId: string, event: KeyboardEvent) :void {
			if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
				// Create post on CTRL + ENTER
				this.send('createReply', forumId);
			}
		}
	}
});
