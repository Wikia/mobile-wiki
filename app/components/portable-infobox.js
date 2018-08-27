import { computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import RenderComponentMixin from '../mixins/render-component';
import { track, trackActions } from '../utils/track';
import offset from '../utils/offset';

export default Component.extend(
	RenderComponentMixin,
	{
		i18n: service(),

		classNames: ['portable-infobox-wrapper'],
		expandButtonClass: 'pi-expand-button',

		height: null,
		infoboxHTML: '',
		collapsed: false,

		button: computed('expandButtonClass', function () {
			return this.element.querySelector(`.${this.expandButtonClass}`);
		}),

		buttonLabel: computed('collapsed', function () {
			return this.get('collapsed') ? this.i18n.t('app.more') : this.i18n.t('app.less');
		}),

		/**
		 * determines if this infobox is a short one or a long one (needs collapsing)
		 */
		isLongInfobox: computed('collapsedHeight', 'height', function () {
			const collapsedHeight = this.collapsedHeight;
			const height = this.height;

			return height > collapsedHeight;
		}),

		/**
		 * return height which should have the collapsed infobox,
		 * basing on the viewport width.
		 * It's taken from 9/16 proportions of screen (width * 16 / 9 + 100px).
		 * We want to always show the image AND some other infobox informations to
		 * indicate that this is infobox, not only an ordinary image.
		 */
		collapsedHeight: computed(() => {
			const deviceWidth = document.documentElement.clientWidth;
			const deviceHeight = document.documentElement.clientHeight;
			const isLandscape = deviceWidth > deviceHeight;

			return Math.floor((isLandscape ? deviceHeight : deviceWidth) * 16 / 9) + 100;
		}),

		didInsertElement() {
			if (this.isLongInfobox) {
				this.collapse();
			}

			this._super(...arguments);
		},

		actions: {
			toogleInfobox() {
				if (!this.collapsed) {
					const body = window.document.body;
					const scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

					this.collapse();
					track({
						action: trackActions.click,
						category: 'portable-infobox',
						label: 'collapsed-by-button',
					});
					scrollTo.apply(this.button);
				} else {
					this.expand();
					track({
						action: trackActions.click,
						category: 'portable-infobox',
						label: 'expanded-by-button',
					});
				}
			},
		},

		click(event) {
			const galleryActionButton = event.target.closest('.image-collection-actions button');

			if (galleryActionButton) {
				this.switchImageInCollection(galleryActionButton);

				return false;
			}

			return undefined;
		},

		switchImageInCollection(galleryActionButton) {
			const galleryWrapper = galleryActionButton.closest('.pi-image-collection');

			if (galleryActionButton.classList.contains('action-next')) {
				const nextFigure = galleryActionButton.closest('figure').nextElementSibling;

				galleryWrapper.scrollLeft += offset(nextFigure).left;
			} else if (galleryActionButton.classList.contains('action-previous')) {
				const previousFigure = galleryActionButton.closest('figure').previousElementSibling;

				galleryWrapper.scrollLeft += offset(previousFigure).left;

			}
		},

		collapse() {
			this.set('collapsed', true);
			this.element.style.height = `${this.collapsedHeight}px`;
			this.element.querySelector('aside').style.height = `${this.collapsedHeight}px`;
		},

		expand() {
			this.set('collapsed', false);
			this.element.style.height = 'auto';
			this.element.querySelector('aside').style.height = 'auto';
		},
	},
);
