import Ember from 'ember';
import DiscussionReplyStickyComponentMixin from '../mixins/discussion-reply-sticky-component';
import DiscussionInlineEditor from './discussion-inline-editor';

export default DiscussionInlineEditor.extend(
	DiscussionReplyStickyComponentMixin,
	{
		containerClassname: '.discussion-inline-editor-floating-container',

		/**
		 * Indicates if the scroll position reached a point where editor should start sticking
		 * @returns {boolean}
		 */
		isStickyBreakpointHeight() {
			return window.pageYOffset >= this.get('offsetTop') - this.get('siteHeadHeight');
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
	}
);
