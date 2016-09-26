import Ember from 'ember';
import DiscussionStickyComponentMixin from '../mixins/discussion-sticky-component';
import DiscussionInlineEditor from './discussion-inline-editor';

const {$, computed, String} = Ember;

export default DiscussionInlineEditor.extend(
	DiscussionStickyComponentMixin,
	{
		containerSelector: '.discussion-inline-editor-floating-container',
		floatingContainerStyleContent: computed('globalNavigationHeight', 'isSticky', 'stickToGlobalNav',
			function () {
				const topValue = this.get('stickToGlobalNav') ? this.get('globalNavigationHeight') : 0,
					style = this.get('isSticky') ? `top: ${topValue}px` : '';

				return String.htmlSafe(style);
			}
		),

		/**
		 * Indicates if the scroll position reached a point where editor should start sticking
		 * @returns {boolean}
		 */
		isStickyBreakpointHeight() {
			return window.pageYOffset >= this.get('offsetTop') -
				(this.get('stickToGlobalNav') ? this.get('globalNavigationHeight') : 0);
		},

		/**
		 * Initialize onScroll binding for sticky logic
		 * @returns {void}
		 */
		initializeStickyState() {
			this.setProperties({
				isSticky: false,
				offsetTop: this.$().offset().top,
				globalNavigationHeight: $('#globalNavigation').outerHeight(true),
			});

			$(window).on('scroll.editor', this.onScroll.bind(this));
		},
	}
);
