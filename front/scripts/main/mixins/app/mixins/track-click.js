App.TrackClickMixin = Em.Mixin.create({
	/**
	 * @param {string} category
	 * @param {string} [label='']
	 * @param {boolean} [isNonInteractive=true]
	 * @returns {void}
	 */
	trackClick(category, label = '', isNonInteractive = true) {
		M.track({
			action: M.trackActions.click,
			category,
			label,
			isNonInteractive
		});
	},

	actions: {
		/**
		 * @param {string} category
		 * @param {string} [label='']
		 * @param {boolean} [isNonInteractive=true]
		 * @returns {void}
		 */
		trackClick(category, label = '', isNonInteractive = true) {
			this.trackClick(category, label, isNonInteractive);
		}
	}
});
