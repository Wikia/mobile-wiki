import Ember from 'ember';
import DiscussionStickyComponentMixin from '../mixins/discussion-sticky-component';
import DiscussionInlineEditor from './discussion-inline-editor';

const {$, observer, run} = Ember;

export default DiscussionInlineEditor.extend(
	DiscussionStickyComponentMixin,
	{
		classNames: ['discussion-inline-reply-editor'],
		containerSelector: '.discussion-inline-editor-floating-container',

		onIsActiveReply: observer('isActive', function () {
			run.scheduleOnce('afterRender', this, function () {
				this.toggleStickyState();
			});
		}),

		/**
		 * @returns {void}
		 */
		scrollAfterEntityAdded() {
			// Scroll to the end of the page while keeping the Global Footer below the fold
			const scrollTop = window.document.body.scrollHeight -
				(window.innerHeight + $('.wds-global-footer').outerHeight(true));

			$('html, body').animate({scrollTop});
		},
	}
);
