import Ember from 'ember';
import FeaturedContentMixin from '../mixins/featured-content.js';
import TrackClickMixin from '../mixins/track-click.js';

const FeaturedContentconstiation1Component = Ember.Component.extend(
	FeaturedContentMixin,
	TrackClickMixin,
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

export default FeaturedContentVariation1Component;
