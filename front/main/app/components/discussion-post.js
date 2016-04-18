import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';

export default Ember.Component.extend(
	DiscussionModalDialogMixin,
	{
		discussionSort: Ember.inject.service(),

		didInsertElement(...params) {
			this._super(...params);
			this.scrollToMarkedReply();
			this.initializeNewerButtons();
		},

		canShowOlder: Ember.computed.oneWay('model.isPreviousPage'),
		canShowNewer: Ember.computed.oneWay('model.isNextPage'),

		canReply: Ember.computed('model.isDeleted', 'model.isLocked', function () {
			return !this.get('model.isDeleted') && !this.get('model.isLocked');
		}),

		// this observer is in use because didInsertElement is not fired when new portion of replies is loaded
		newRepliesLoadedObserver: Ember.observer('model.replies.length', function () {
			Ember.run.scheduleOnce('afterRender', this, () => {
				this.scrollToMarkedReply();
			});
		}),

		scrollToMarkedReply() {
			const markedClassName = 'scroll-to-mark',
			$markedElements = this.$(`.${markedClassName}`);

			if ($markedElements.length) {
				window.scrollTo(0, $markedElements.offset().top - Ember.$('.site-body-discussion').offset().top);
				$markedElements.removeClass(markedClassName);
			}
		},

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

			if ($wideButton.length && window.innerHeight + window.scrollY <= $wideButton.offset().top) {
				$floatingButton.css('bottom', floatingBtnSpace).show();

				Ember.run.later(() => {
					Ember.$(window).one('scroll', () => {
						$floatingButton.hide();
					});
				}, floatingBtnScrollHideDelay);
			}
		},
	}
);
