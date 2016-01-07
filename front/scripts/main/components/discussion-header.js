import HeadroomMixin from '../mixins/headroom';

export default Ember.Component.extend(
	HeadroomMixin,
	{
		classNames: ['discussion-header', 'background-theme-color'],

		overlayVisible: false,
		showContent: true,

		siteName: Ember.computed(() => {
			return Ember.get(Mercury, 'wiki.siteName');
		}),

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this._super();
		},

		actions: {
			/**
			 * @returns {void}
			 */
			showSortComponent() {
				this.sendAction('showSortComponent');
			},

			/**
			 * @returns {void}
			 */
			hideSortComponent() {
				this.sendAction('hideSortComponent');
			},
		},
	}
);
