import DiscussionStickyComponentMixin from '../mixins/discussion-sticky-component';
import DiscussionInlineEditor from './discussion-inline-editor';

export default DiscussionInlineEditor.extend(
	DiscussionStickyComponentMixin,
	{
		containerSelector: '.discussion-inline-editor-floating-container',
		floatingContainerTop: Ember.computed('globalNavigationHeight', 'isSticky', function () {
			return !this.get('isSticky') ? 0 : this.get('globalNavigationHeight');
		}),

		/**
		 * Indicates if the scroll position reached a point where editor should start sticking
		 * @returns {boolean}
		 */
		isStickyBreakpointHeight() {
			return window.pageYOffset >= this.get('offsetTop') - this.get('globalNavigationHeight');
		},

		/**
		 * Initialize onScroll binding for sticky logic
		 * @returns {void}
		 */
		initializeStickyState() {
			this.setProperties({
				isSticky: false,
				offsetTop: this.$().offset().top,
				globalNavigationHeight: Ember.$('#globalNavigation').outerHeight(true),
			});

			Ember.$(window).on('scroll.editor', this.onScroll.bind(this));
		},
	}
);
