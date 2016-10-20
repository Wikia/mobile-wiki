import Ember from 'ember';
import localStorageConnector from '../utils/local-storage-connector';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(
	ResponsiveMixin,
	{
		classNames: ['discussion-tooltip-wrapper'],
		localStorageId: null,
		show: null,
		showOnce: true,
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
		onSeenChange: function() {
			if (this.get('seen')) {
				localStorageConnector.setItem(this.get('localStorageId'), true);
				this.toggleProperty('wasSeen', true);
				this.removeObserver('seen', this.onSeenChange);
			}
		},

		isVisible: Ember.computed('show', 'showOnce', 'wasSeen', function () {
			return this.get('show') && (this.get('showOnce') ? !this.get('wasSeen') : true);
		}),

		wasSeen: Ember.computed('localStorageId', function() {
			return Boolean(localStorageConnector.getItem(this.get('localStorageId')));
		})
	});
