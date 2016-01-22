import Ember from 'ember';
import ArticleContentMixin from '../mixins/article-content';
import ViewportMixin from '../mixins/viewport';

export default Ember.Component.extend(
	ArticleContentMixin,
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
		clickableElements: ['a', 'button', 'img'],

		button: Ember.computed('expandButtonClass', function () {
			return this.$(`.${this.get('expandButtonClass')}`)[0];
		}),

		/**
		 * determines if this infobox is a short one or a long one (needs collapsing)
		 */
		isLongInfobox: Ember.computed('collapsedHeight', 'height', {
			get() {
				const collapsedHeight = this.get('collapsedHeight'),
					height = this.get('height');

				return height > collapsedHeight;
			},
		}),

		/**
		 * return height which should have the collapsed infobox,
		 * basing on the viewport width.
		 * It's taken from 9/16 proportions of screen (width * 16 / 9 + 100px).
		 * We want to always show the image AND some other infobox informations to
		 * indicate that this is infobox, not only an ordinary image.
		 */
		collapsedHeight: Ember.computed('viewportDimensions.width', 'viewportDimensions.height', function () {
			const deviceWidth = this.get('viewportDimensions.width'),
				deviceHeight = this.get('viewportDimensions.height'),
				isLandscape = deviceWidth > deviceHeight;

			return Math.floor((isLandscape ? deviceHeight : deviceWidth) * 16 / 9) + 100;
		}),

		/**
		 * @returns {void}
		 */
		handleCollapsing() {
			const collapsedHeight = this.get('collapsedHeight');

			this.set('collapsed', true);
			this.$().height(collapsedHeight);
		},

		/**
		 * handles click on infobox.
		 * Function is active only for the long infoboxes.
		 * Changes 'collapsed' property.
		 * Should not make any effect if the clicked element
		 * is a link, button or image.
		 *
		 * @param {JQueryEventObject} event
		 * @returns {void}
		 */
		onInfoboxClick(event) {
			const collapsed = this.get('collapsed');

			if (!this.shouldHandleCollapsing($(event.target))) {
				return;
			}

			if (!collapsed) {
				const body = window.document.body,
					scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

				this.handleCollapsing();
				scrollTo.apply(this.get('button'));
			} else {
				this.set('collapsed', false);
				this.$().height('auto');
			}
		},

		/**
		 * If element is one of clickableElements, collapsing of infobox should not be handled.
		 * As this element has it's own action, not connected to collapsing/uncollapsing infobox.
		 *
		 * @param {JQuery} $target
		 * @returns {bool}
		 */
		shouldHandleCollapsing($target) {
			const clickableElements = this.get('clickableElements');

			return !clickableElements.some((element) => {
				return $target.is(element);
			});
		},

		/**
		 * In case of long infobox, setups click
		 * handling function to this infobox component.
		 *
		 * @returns {void}
		 */
		didInsertElement() {
			if (this.get('isLongInfobox')) {
				this.handleCollapsing();
				this.$().click(this.onInfoboxClick.bind(this));
			}
		},
	}
);
