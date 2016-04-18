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

		newRepliesLoadedObserver: Ember.observer('model.replies.length', function () {
			Ember.run.scheduleOnce('afterRender', this, this.scrollToMarkedReply);
		}),

		canReply: Ember.computed('model.isDeleted', 'model.isLocked', function () {
			return !this.get('model.isDeleted') && !this.get('model.isLocked');
		}),

		canShowNewer: Ember.computed.oneWay('model.isNextPage'),
		canShowOlder: Ember.computed.oneWay('model.isPreviousPage'),

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
				floatingButtonScrollHideDelay = 1000;

			if ($wideButton.length && window.innerHeight + window.scrollY <= $wideButton.offset().top) {
				$floatingButton.addClass('bottom-space').show();

				Ember.run.later(() => {
					Ember.$(window).one('scroll', () => {
						$floatingButton.hide();
					});
				}, floatingButtonScrollHideDelay);
			}
		},
	}
);
