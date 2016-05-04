import Ember from 'ember';
import DiscussionEditorComponent from './discussion-editor';

export default DiscussionEditorComponent.extend({
	classNames: ['mobile-hidden'],
	pinnedClassName: 'pinned-top',

	placeholderText: 'editor.post-editor-placeholder-text',
	submitText: 'editor.post-action-button-label',
	labelText: 'editor.post-editor-label',

	didInsertElement() {
		this._super(...arguments);
		this.get('discussionEditor').on('newPost', () => {
			this.handleNewPostCreated();
		});
		this.initializeStickyState();
	},

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	initializeStickyState() {
		this.setProperties({
			isSticky: false,
			offsetTop: this.$().offset().top,
			siteHeadHeight: Ember.$('.site-head').outerHeight(true),
		});

		Ember.$(window).on('scroll.editor', this.onScroll.bind(this));
	},

	/**
	 * Indicates if the scroll position reached a point where editor should start sticking
	 * @returns {boolean}
	 */
	isStickyBreakpointHeight() {
		return window.pageYOffset >= this.get('offsetTop') - (this.get('siteHeadPinned') ? this.get('siteHeadHeight') : 0);
	},

	/**
	 * Handle recalculation of placeholder size on resize
	 * @returns {void}
	 */
	viewportChangeObserver: Ember.observer('viewportDimensions.width', function () {
		Ember.$(window).off('scroll.editor');
		this.initializeStickyState();
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
				.css('height', '100px')
				.on('focus', () => {
					setTimeout(() => {
						$editorTextarea.css('height', '100%');
					}, 500);
				})
				.on('blur', () => {
					$editorTextarea.css('height', '100px');
				});
		}
	},

	/**
	 * Perform animations and logic after post creation
	 * @returns {void}
	 */
	handleNewPostCreated() {
		const newPosts = this.get('posts').filter((post) => post.get('isNew')),
			newPost = newPosts.get('firstObject');

		if (newPost) {
			Ember.$('html, body').animate({scrollTop: 0});
			this.handleNewItemCreated(newPost);
		}
	},
});
