App.FeaturedContentVariation1Component = Em.Component.extend(
	App.FeaturedContentMixin,
	App.TrackClickMixin,
	{
		classNames: ['featured-content-variation-1'],

		gestures: {
			/**
			 * @returns {void}
			 */
			swipeLeft() {
				M.VariantTesting.trackEvent('featured-content-next');
				this.nextItem();
			},

			/**
			 * @returns {void}
			 */
			swipeRight() {
				M.VariantTesting.trackEvent('featured-content-prev');
				this.prevItem();
			},
		},

		/**
		 * @returns {void}
		 */
		click() {
			M.VariantTesting.trackEvent('featured-content-click');
			this.trackClick('modular-main-page', 'featured-content');
		},
	}
);
