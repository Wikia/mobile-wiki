import Ember from 'ember';
import localStorageConnector from '../utils/local-storage-connector';
import ResponsiveMixin from '../mixins/responsive';
import ViewportMixin from '../mixins/viewport';
const {String} = Ember;

export default Ember.Component.extend(
	ResponsiveMixin,
	ViewportMixin,
	{
		/**
		 * Arrow vertical offset from 'pointingTo' element
		 */
		arrowOffset: 3,
		attributeBindings: ['style'],
		classNames: ['discussion-tooltip-wrapper'],
		localStorageId: null,
		/**
		 * Css selector for parent element (that has position: relative).
		 */
		parent: '',
		/**
		 * Css selector for element that this tooltip will pointing to
		 */
		pointingTo: '',
		/**
		 * Offset for right side, when tooltip would stick out from viewport
		 */
		rightOffset: 2,
		show: false,
		/**
		 * Controls whether tooltip should appear once, and never again
		 * (when some action changing seen property occurred)
		 */
		showOnce: true,
		/**
		 * Default text, used by both desktop and mobile
		 */
		text: '',
		textOnDesktop: '',
		textOnMobile: '',

		// position
		arrowMarginLeft: 0,
		left: 0,
		top: 0,

		/**
		 * @private
		 */
		init() {
			this._super(...arguments);
			this.populateTooltipTexts();
			this.attachObservers();
		},

		/**
		 * @private
		 */
		populateTooltipTexts() {
			const text = this.get('text'),
				textOnDesktop = this.get('textOnDesktop'),
				textOnMobile = this.get('textOnMobile');

			this.set('textOnDesktop', Boolean(textOnDesktop) ? textOnDesktop : text);
			this.set('textOnMobile', Boolean(textOnMobile) ? textOnMobile : text);
		},

		/**
		 * @private
		 */
		attachObservers() {
			if (this.get('showOnce') && !this.get('wasSeen')) {
				this.addObserver('seen', this.onSeenChange);
				this.addObserver('viewportDimensions.width', this.onViewportChange);
			}
		},

		/**
		 * @private
		 */
		onSeenChange() {
			if (this.get('seen')) {
				localStorageConnector.setItem(this.get('localStorageId'), true);
				this.set('wasSeen', true);
				this.removeObservers();
			}
		},

		/**
		 * @private
		 */
		removeObservers() {
			this.removeObserver('seen', this.onSeenChange);
			this.removeObserver('viewportDimensions.width', this.onViewportChange);
		},

		/**
		 * @private
		 */
		onViewportChange() {
			Ember.run.schedule('afterRender', this, function () {
				this.computeTooltipPosition();
			});
		},

		didInsertElement() {
			this._super(...arguments);
			Ember.run.schedule('afterRender', this, function () {
				this.computeTooltipPosition();
			});
		},

		/**
		 * This method automatically finds tooltip position above element 'pointingTo' in element 'parent'.
		 * 'pointingTo' element will be pointed by arrow.
		 *
		 * @private
		 */
		computeTooltipPosition() {
			if (this.get('isVisible')) {
				const width = this.$().width(),
					parentOffset = this.$().parents(this.get('parent')).offset(),
					pointingToElement = this.$().parent().find(this.get('pointingTo')),
					elementOffset = pointingToElement.offset(),
					elementWidth = pointingToElement.width();

				let arrowMarginLeft = 0,
					left = (elementOffset.left - parentOffset.left) - (width / 2) + (elementWidth / 2),
					top = (elementOffset.top - parentOffset.top) - this.$().height() - this.get('arrowOffset');

				if (this.tooltipWillStickOutFromViewport(left + width)) {
					let leftInViewport = window.innerWidth - width - this.get('rightOffset');

					arrowMarginLeft = (left - leftInViewport) * 2;
					left = leftInViewport;
				}

				this.set('top', top);
				this.set('left', left);
				this.set('arrowMarginLeft', arrowMarginLeft);
			}
		},

		/**
		 * @private
		 * @returns {boolean}
		 */
		tooltipWillStickOutFromViewport(elementRightCorner) {
			return window.innerWidth < elementRightCorner;
		},

		style: Ember.computed('top', 'left', function () {
			return String.htmlSafe(`top: ${this.get('top')}px; left: ${this.get('left')}px;`);
		}),

		arrowStyle: Ember.computed('arrowMarginLeft', function () {
			return String.htmlSafe(`margin-left: ${this.get('arrowMarginLeft')}px;`);
		}),

		isVisible: Ember.computed('show', 'showOnce', 'wasSeen', function () {
			return Boolean(this.get('show')) && (this.get('showOnce') ? !this.get('wasSeen') : true);
		}),

		wasSeen: Ember.computed('localStorageId', function () {
			return Boolean(localStorageConnector.getItem(this.get('localStorageId')));
		})
	});
