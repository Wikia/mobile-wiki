App.FeaturedContentVariation2Component = Em.Component.extend(
	App.FeaturedContentMixin,
	App.TrackClickMixin,
	App.ThirdsClickMixin,
	{
		classNames: ['featured-content-variation-2'],
		showChevrons: Em.computed.readOnly('hasMultipleItems'),

		screenEdgeWidthRatio: Em.computed('hasMultipleItems', function () {
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
