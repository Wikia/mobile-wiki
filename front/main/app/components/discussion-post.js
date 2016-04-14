import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';
import DiscussionPermalinkMixin from '../mixins/discussion-permalink';

export default Ember.Component.extend(
	DiscussionModalDialogMixin,
	DiscussionPermalinkMixin,
	{
		discussionSort: Ember.inject.service(),

		didInsertElement(...params) {
			this._super(...params);
			this.initializeNewerButtons();
		},

		canShowOlder: Ember.computed('model.replies.firstObject.position', function () {
			return this.get('model.replies.firstObject.position') > 1;
		}),

		canShowNewer: Ember.computed('model.replies.lastObject.position', 'model.repliesCount', function () {
			return this.get('model.replies.lastObject.position') < this.get('model.repliesCount');
		}),

		canReply: Ember.computed('model.isDeleted', 'model.isLocked', function () {
			return !this.get('model.isDeleted') && !this.get('model.isLocked');
		}),

		/**
		 * This method displays the floating 'load newer replies' button when it's needed.
		 * It appears when:
		 * 1. there is no wide 'newer replies' bottom button visible
		 * 2. after 1 sec visibility, when user starts to scroll the document it disappears
		 * @returns {void}
		 */
		initializeNewerButtons() {
			const $floatingButton = Ember.$('.load-newer.floating'),
				$wideButton = Ember.$('.load-newer.wide'),
				floatingBtnSpace = 80,
				floatingBtnScrollHideDelay = 1000;

			if (window.innerHeight <= $wideButton.offset().top) {
				$floatingButton.css('bottom', buttonBottomSpace).show();

				Ember.run.later(() => {
					Ember.$(window).one('scroll', () => {
						$floatingButton.hide();
					});
				}, floatingBtnScrollHideDelay);
			}
		},
	}
);
