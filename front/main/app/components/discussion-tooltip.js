import Ember from 'ember';
import localStorageConnector from '../utils/local-storage-connector';
import ViewportMixin from '../mixins/viewport';
const {String} = Ember;

export default Ember.Component.extend(
	ViewportMixin,
	{
		arrowDirection: 'down',
		/**
		 * Arrow vertical offset from 'pointingTo' element
		 */
		arrowOffset: 3,
		attributeBindings: ['style'],
		classNameBindings: ['arrowDirection'],
		classNames: ['discussion-tooltip-wrapper'],
		localStorageId: null,
		/**
		 * Css selector for parent element (that has position: relative).
		 * If not set jQuery's offsetParent() method will be used.
		 */
		parent: null,
		/**
		 * Css selector for element that this tooltip will pointing to
		 */
		pointingTo: '',
		/**
		 * Offset for right side, when tooltip would stick out from viewport
		 */
		rightOffset: 3,
		/**
		 * Property controlling whether tooltip was seen or not. Do not set 'wasSeen' property which is computed
		 * based on local storage property.
		 */
		seenInCurrentSession: false,
		shouldShow: false,
		/**
		 * Controls whether tooltip should appear once, and never again
		 * (when some action changing seen property occurred)
		 */
		shouldShowOnce: true,
		/**
		 * Controls whether tooltip should show once in whole application.
		 * Even if there are multiple instances of this tooltip defined, if one will show, other will be invisible.
		 */
		shouldShowOnceInApplication: false,
		/**
		 * Default text, used by both desktop and mobile
		 */
		text: '',
		/**
		 * Controls whether tooltip should appear only once when isVisible changes to true and never again.
		 */
		visibleOnce: false,

		// position
		arrowMarginLeft: 0,
		left: 0,
		top: 0,
		/**
		 * Value used to preserve width when view port changes
		 * @private
		 */
		width: null,

		/**
		 * @private
		 */
		init() {
			this._super(...arguments);
			this.attachObservers();
		},

		/**
		 * @private
		 */
		attachObservers() {
			if (this.get('shouldShowOnce') && !this.get('wasSeen')) {
				this.addObserver('seenInCurrentSession', this.onSeenChange);
				this.addObserver('viewportDimensions.width', this.onViewportChange);
			}
		},

		/**
		 * @private
		 */
		onSeenChange() {
			if (this.get('seenInCurrentSession')) {
				localStorageConnector.setItem(this.get('localStorageId'), true);
				this.removeObservers();
			}
		},

		/**
		 * @private
		 */
		removeObservers() {
			this.removeObserver('seenInCurrentSession', this.onSeenChange);
			this.removeObserver('viewportDimensions.width', this.onViewportChange);
		},

		/**
		 * @private
		 */
		onViewportChange() {
			this.computePositionAfterRender();
		},

		/**
		 * @private
		 */
		computePositionAfterRender() {
			Ember.run.schedule('afterRender', this, function () {
				this.computeTooltipPosition();
			});
		},

		didRender() {
			this._super(...arguments);

			if (this.get('width') === null) {
				this.set('width', parseInt(this.$().css('width'), 10));
			}

			this.computePositionAfterRender();
		},

		/**
		 * This method automatically finds tooltip position above element 'pointingTo' in element 'parent'.
		 * 'pointingTo' element will be pointed by arrow.
		 *
		 * @private
		 */
		computeTooltipPosition() {
			if (this.get('isVisible')) {
				const direction = this.get('arrowDirection');

				if (direction === 'down') {
					this.computeTooltipPositionWithArrowDown();
				} else if (direction === 'right') {
					this.computeTooltipPositionWithArrowRight();
				}
			}
		},

		/**
		 * @private
		 */
		computeTooltipPositionWithArrowDown() {
			const width = this.get('width'),
				parentOffset = this.offsetParent().offset(),
				pointingToElement = this.pointingToElement(),
				elementOffset = pointingToElement.offset(),
				elementWidth = pointingToElement.width();

			let arrowMarginLeft = 0,
				top = elementOffset.top - parentOffset.top - this.$().height() - this.get('arrowOffset'),
				left = elementOffset.left - parentOffset.left - (width / 2) + (elementWidth / 2);

			if (this.tooltipWillStickOutFromViewport(left + width)) {
				let leftInViewport = window.innerWidth - width - this.get('rightOffset');

				arrowMarginLeft = (left - leftInViewport) * 2;
				left = leftInViewport;
			}

			this.setProperties({
				top,
				left,
				arrowMarginLeft
			});
		},

		/**
		 * @private
		 * @returns {offset}
		 */
		offsetParent() {
			const parent = this.get('parent');

			return parent ? this.$().parents(parent) : this.$().offsetParent();
		},

		/**
		 * @private
		 * @returns {element}
		 */
		pointingToElement() {
			return this.offsetParent().find(this.get('pointingTo'));
		},

		/**
		 * @private
		 * @returns {boolean}
		 */
		tooltipWillStickOutFromViewport(elementRightCorner) {
			return window.innerWidth < elementRightCorner;
		},

		/**
		 * @private
		 */
		computeTooltipPositionWithArrowRight() {
			const height = this.$().height(),
				width = this.get('width'),
				parentOffset = this.offsetParent().offset(),
				pointingToElement = this.pointingToElement(),
				elementOffset = pointingToElement.offset(),
				elementHeight = pointingToElement.height();

			let top = elementOffset.top - parentOffset.top - (height / 2) + (elementHeight / 2),
				left = elementOffset.left - parentOffset.left - width - this.get('arrowOffset');

			this.setProperties({
				top,
				left,
				arrowMarginLeft: 0
			});
		},

		style: Ember.computed('top', 'left', function () {
			return String.htmlSafe(`top: ${this.get('top')}px; left: ${this.get('left')}px;`);
		}),

		arrowStyle: Ember.computed('arrowMarginLeft', function () {
			return String.htmlSafe(`margin-left: ${this.get('arrowMarginLeft')}px;`);
		}),

		isVisible: Ember.computed('shouldShow', 'seenInCurrentSession', 'wasSeen', function () {
			const visible = Boolean(this.get('shouldShow')) && (this.get('shouldShowOnce') ? this.wasNotAlreadySeen() : true);

			if (visible && this.get('visibleOnce')) {
				localStorageConnector.setItem(this.get('localStorageId'), true);
			}
			return visible;
		}),

		wasNotAlreadySeen() {
			return !this.get('seenInCurrentSession') && !this.get('wasSeen');
		},

		/**
		 * Checks if tooltip was already seen using local storage.
		 * @returns {boolean}
		 */
		wasSeen: Ember.computed('localStorageId', function () {
			return Boolean(localStorageConnector.getItem(this.get('localStorageId')));
		})
	});
