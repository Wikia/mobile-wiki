import {computed} from '@ember/object';
import Component from '@ember/component';
import ViewportMixin from '../mixins/viewport';
import RenderComponentMixin from '../mixins/render-component';
import {track, trackActions} from '../utils/track';
import {inGroup} from '../modules/abtest';

export default Component.extend(
	RenderComponentMixin,
	ViewportMixin,
	{
		classNames: ['portable-infobox'],
		classNameBindings: ['collapsed'],
		expandButtonClass: 'pi-expand-button',
		layoutName: 'components/portable-infobox',
		tagName: 'aside',

		height: null,
		infoboxHTML: '',
		collapsed: false,

		button: computed('expandButtonClass', function () {
			return this.$(`.${this.get('expandButtonClass')}`)[0];
		}),

		/**
		 * determines if this infobox is a short one or a long one (needs collapsing)
		 */
		isLongInfobox: computed('collapsedHeight', 'height', {
			get() {
				const collapsedHeight = this.get('collapsedHeight'),
					height = this.get('height');

				return height > collapsedHeight;
			}
		}),

		/**
		 * return height which should have the collapsed infobox,
		 * basing on the viewport width.
		 * It's taken from 9/16 proportions of screen (width * 16 / 9 + 100px).
		 * We want to always show the image AND some other infobox informations to
		 * indicate that this is infobox, not only an ordinary image.
		 */
		collapsedHeight: computed('viewportDimensions.{width,height}', function () {
			const deviceWidth = this.get('viewportDimensions.width'),
				deviceHeight = this.get('viewportDimensions.height'),
				isLandscape = deviceWidth > deviceHeight,
				calculatedHeight = Math.floor((isLandscape ? deviceHeight : deviceWidth) * 16 / 9) + 100,
				maximumRequiredHeight = 500;

			/**
			 * FIXME FEATURED VIDEO A/B TEST ONLY
			 */
			if (inGroup('FEATURED_VIDEO_VIEWABILITY_VARIANTS', 'PAGE_PLACEMENT')) {
				return calculatedHeight > maximumRequiredHeight ? maximumRequiredHeight : calculatedHeight;
			}

			return calculatedHeight;
		}),

		didInsertElement() {
			if (this.get('isLongInfobox')) {
				this.collapse();
			}

			this._super(...arguments);
		},

		collapse() {
			this.set('collapsed', true);
			this.$().height(this.get('collapsedHeight'));
		},

		expand() {
			this.set('collapsed', false);
			this.$().height('auto');
		},

		actions: {
			toogleInfobox() {
				if (!this.get('collapsed')) {
					const body = window.document.body,
						scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

					this.collapse();
					track({
						action: trackActions.click,
						category: 'portable-infobox',
						label: 'collapsed-by-button'
					});
					scrollTo.apply(this.get('button'));
				} else {
					this.expand();
					track({
						action: trackActions.click,
						category: 'portable-infobox',
						label: 'expanded-by-button'
					});
				}
			}
		}
	}
);
