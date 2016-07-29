import DiscussionStickyComponentMixin from '../mixins/discussion-sticky-component';
import DiscussionInlineEditor from './discussion-inline-editor';

export default DiscussionInlineEditor.extend(
	DiscussionStickyComponentMixin,
	{
		classNames: ['discussion-inline-reply-editor'],
		containerSelector: '.discussion-inline-editor-floating-container',

		onIsActiveReply: Ember.observer('isActive', function () {
			Ember.run.scheduleOnce('afterRender', this, function () {
				this.toggleStickyState();
			});
		}),

		/**
		 * @returns {void}
		 */
		scrollAfterEntityAdded() {
			Ember.$('html, body').animate({scrollTop: window.document.body.scrollHeight});
		},
	}
);
