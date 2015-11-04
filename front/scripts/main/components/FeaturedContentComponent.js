App.FeaturedContentComponent = Em.Component.extend(
	App.FeaturedContentMixin,
	App.TrackClickMixin,
	App.ThirdsClickMixin,
	{
		// See ThirdsClickMixin
		screenEdgeWidthRatio: (1 / 6),

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
		 * @returns {boolean}
		 */
		rightClickHandler() {
			M.VariantTesting.trackEvent('featured-content-next');
			this.nextItem();
			return true;
		},

		/**
		 * @returns {boolean}
		 */
		leftClickHandler() {
			M.VariantTesting.trackEvent('featured-content-prev');
			this.prevItem();
			return true;
		},

		/**
		 * @returns {boolean}
		 */
		centerClickHandler() {
			this.trackClick('modular-main-page', 'featured-content');
			M.VariantTesting.trackEvent('featured-content-click');
			return false;
		},

		/**
		 * @param {PreventableClickEvent} event
		 * @returns {void}
		 */
		click(event) {
			this.callClickHandler(event, true);
		},
	}
);
