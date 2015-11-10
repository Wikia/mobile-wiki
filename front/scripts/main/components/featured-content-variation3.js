import Ember from 'ember';

const FeaturedContentVariation3Component = Ember.Component.extend(
	FeaturedContentMixin,
	TrackClickMixin,
	ThirdsClickMixin,
	{
		classNames: ['featured-content-variation-3'],
		isTimeoutHandleSet: false,
		cycleTimeoutHandle: null,
		// This is how long it takes to read the item caption out loud ~2.5 times, based on guidelines from movie credits
		cycleInterval: 6250,
		showChevrons: Ember.computed.readOnly('hasMultipleItems'),
		screenEdgeWidthRatio: Ember.computed('hasMultipleItems', function () {
			if (this.get('hasMultipleItems')) {
				return (1 / 6);
			}
			return 0;
		}),

		/**
		 * @returns {boolean}
		 */
		rightClickHandler() {
			M.VariantTesting.trackEvent('featured-content-next');
			this.nextItem();
			this.resetCycleTimeout();
			return true;
		},

		/**
		 * @returns {boolean}
		 */
		leftClickHandler() {
			M.VariantTesting.trackEvent('featured-content-prev');
			this.prevItem();
			this.resetCycleTimeout();
			return true;
		},

		/**
		 * @returns {boolean}
		 */
		centerClickHandler() {
			this.stopCyclingThroughItems();
			this.trackClick('modular-main-page', 'featured-content');
			M.VariantTesting.trackEvent('featured-content-click');
			return false;
		},

		/**
		 * @param {MouseEvent|Touch} event
		 * @returns {void}
		 */
		click(event) {
			this.callClickHandler(event, true);
		},

		/**
		 * @returns {void}
		 */
		cycleThroughItems() {
			if (this.get('hasMultipleItems') && !this.get('isTimeoutHandleSet')) {
				this.set('cycleTimeoutHandle', Ember.run.later(this, () => {
					this.set('isTimeoutHandleSet', false);
					this.nextItem();
					this.cycleThroughItems();
				}, this.cycleInterval));
				this.set('isTimeoutHandleSet', true);
			}
		},

		/**
		 * @returns {void}
		 */
		stopCyclingThroughItems() {
			if (this.get('hasMultipleItems')) {
				Ember.run.cancel(this.get('cycleTimeoutHandle'));
				this.set('isTimeoutHandleSet', false);
			}
		},

		/**
		 * @returns {void}
		 */
		resetCycleTimeout() {
			if (this.get('hasMultipleItems')) {
				this.stopCyclingThroughItems();
				this.cycleThroughItems();
			}
		},

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this.cycleThroughItems();
		},

		/**
		 * @returns {void}
		 */
		willDestroyElement() {
			this.stopCyclingThroughItems();
		},
	}
);

export default FeaturedContentVariation3Component;
