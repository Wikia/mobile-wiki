import Ember from 'ember';
import FeaturedContentMixin from '../mixins/featured-content.js';
import TrackClickMixin from '../mixins/track-click.js';
import ThirdsClickMixin from '../mixins/thirds-click.js';

const FeaturedContentVariation2Component = Ember.Component.extend(
	FeaturedContentMixin,
	TrackClickMixin,
	ThirdsClickMixin,
	{
		classNames: ['featured-content-variation-2'],
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

export default FeaturedContentVariation2Component;
