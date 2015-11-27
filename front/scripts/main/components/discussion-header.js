import App from '../app';
import HeadroomMixin from '../mixins/headroom';

export default App.DiscussionHeaderComponent = Ember.Component.extend(
	HeadroomMixin,
	{
		classNames: ['discussion-header', 'background-theme-color'],

		overlay: null,
		showContent: true,

		siteName: Ember.computed(() => {
			return Ember.get(Mercury, 'wiki.siteName');
		}),

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this.set('overlay', this.element.querySelector('.overlay'));
			this._super();
		},

		actions: {
			/**
			 * @returns {void}
			 */
			showSortComponent() {
				this.sendAction('showSortComponent');
				this.get('overlay').style.display = 'block';
			},

			/**
			 * @returns {void}
			 */
			hideSortComponent() {
				this.sendAction('hideSortComponent');
				this.get('overlay').style.display = 'none';
			},
		},
	}
);
