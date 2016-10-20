import Ember from 'ember';
import localStorageConnector from '../utils/local-storage-connector';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(
	ResponsiveMixin,
	{
		arrowOffset: 3,
		arrowStyle: '',
		attributeBindings: ['style'],
		classNames: ['discussion-tooltip-wrapper'],
		localStorageId: null,
		parent: '',
		pointingTo: '',
		rightOffset: 2,
		show: false,
		showOnce: true,
		style: null,
		text: '',
		textOnDesktop: '',
		textOnMobile: '',

		init() {
			this._super(...arguments);
			this.populateTooltipTexts();
			this.attachObserver();
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
		attachObserver() {
			if (this.get('showOnce') && !this.get('wasSeen')) {
				this.addObserver('seen', this.onSeenChange);
			}
		},

		/**
		 * @private
		 */
		onSeenChange: function () {
			if (this.get('seen')) {
				localStorageConnector.setItem(this.get('localStorageId'), true);
				this.toggleProperty('wasSeen', true);
				this.removeObserver('seen', this.onSeenChange);
			}
		},

		didInsertElement() {
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

				let left = (elementOffset.left - parentOffset.left) - (width / 2) + (elementWidth / 2),
					top = (elementOffset.top - parentOffset.top) - this.$().height() - this.get('arrowOffset');

				if (this.tooltipWillStickOutOfViewport(left + width)) {
					let leftInViewport = window.innerWidth - width - this.get('rightOffset'),
						arrowLeftMargin = (left - leftInViewport) * 2;
					this.set('arrowStyle', Ember.String.htmlSafe(`margin-left: ${arrowLeftMargin}px;`));
					left = leftInViewport;
				}

				this.set('style', Ember.String.htmlSafe(`top: ${top}px; left: ${left}px;`));
			}
		},

		/**
		 * @private
		 * @returns {boolean}
		 */
		tooltipWillStickOutOfViewport(elemntRightCorner) {
			return window.innerWidth < elemntRightCorner;
		},

		isVisible: Ember.computed('show', 'showOnce', 'wasSeen', function () {
			return Boolean(this.get('show')) && (this.get('showOnce') ? !this.get('wasSeen') : true);
		}),

		wasSeen: Ember.computed('localStorageId', function () {
			return Boolean(localStorageConnector.getItem(this.get('localStorageId')));
		})
	});
