import DiscussionStickyComponentMixin from '../mixins/discussion-sticky-component';
import DiscussionInlineEditor from './discussion-inline-editor';

export default DiscussionInlineEditor.extend(
	DiscussionStickyComponentMixin,
	{
		classNames: ['discussion-inline-reply-editor'],
		containerClassname: '.discussion-inline-editor-floating-container',

		/**
		 * @returns {void}
		 */
		scrollAfterEntityAdded() {
			Ember.$('html, body').animate({scrollTop: Ember.$('body').height()});
		},
	}
);
