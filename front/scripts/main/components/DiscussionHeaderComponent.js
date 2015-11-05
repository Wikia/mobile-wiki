App.DiscussionHeaderComponent = Em.Component.extend(
	App.HeadroomMixin,
	{
		classNames: ['discussion-header'],

		overlay: null,
		showContent: true,

		siteName: Em.computed(() => {
			return Em.get(Mercury, 'wiki.siteName');
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
