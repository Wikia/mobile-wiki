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
		this.get('discussionEditor').on('newPost', this, this.handlePostCreated);
		this.initializeStickyState();
	},

	willDestroyElement() {
		this.get('discussionEditor').off('newPost', this, this.handlePostCreated);
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
		return window.pageYOffset >= this.get('offsetTop') - this.get('siteHeadHeight');
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
	 * Perform animations and logic after post creation
	 * @returns {void}
	 */
	handlePostCreated() {
		const newPosts = this.get('posts').filter((post) => post.get('isNew')),
			newPost = newPosts.get('firstObject');

		if (newPost) {
			Ember.$('html, body').animate({scrollTop: 0});
			this.handleNewItemCreated(newPost);
		}
	},
});
