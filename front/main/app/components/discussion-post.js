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

		isFloatingButton: false,
		isFloatingButtonBottomSpace: false,

		newRepliesLoadedObserver: Ember.observer('model.replies.length', function () {
			Ember.run.scheduleOnce('afterRender', this, this.scrollToMarkedReply);
		}),

		canReply: Ember.computed('model.isDeleted', 'model.isLocked', function () {
			return !this.get('model.isDeleted') && !this.get('model.isLocked');
		}),

		canShowNewer: Ember.computed.oneWay('model.isNextPage'),
		canShowOlder: Ember.computed.oneWay('model.isPreviousPage'),

		/**
		 * This method finds a reply with 'scroll-to-mark' class set, and then scrolls the document to have the reply
		 * on the top of visible part of the Discussions. So the document needs to be scrolled to a position where the
		 * reply is placed, remembering that the discussions itself might be not at the top of the document - there
		 * can be GlobalNav or some Ad at the top.
		 * At the end the 'scroll-to-mark' class is removed from the reply.
		 * @returns {void}
		 */
		scrollToMarkedReply() {
			const markedClassName = 'scroll-to-mark',
				$markedElements = this.$(`.${markedClassName}`);

			if ($markedElements.length) {
				$('html, body').animate({
					scrollTop: $markedElements.offset().top - Ember.$('.site-body-discussion').offset().top
				});
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
			const $lastReply = this.$('.post-reply:last'),
				floatingButtonScrollHideDelay = 1000;

			if ($lastReply.length &&
				window.innerHeight + window.scrollY <= $lastReply.offset().top + $lastReply.outerHeight()
			) {

				this.setProperties({
					isFloatingButton: true,
					isFloatingButtonBottomSpace: true
				});

				Ember.run.later(() => {
					Ember.$(window).one('scroll', () => {
						this.setProperties({
							isFloatingButton: false,
							isFloatingButtonBottomSpace: false
						});
					});
				}, floatingButtonScrollHideDelay);
			}
		},
	}
);
