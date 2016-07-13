export default Ember.Mixin.create({
	classNames: ['discussions-collapsable'],
	classNameBindings: ['collapsed'],
	collapsed: false,

	/**
	 * This could be overwritten where the mixin is used and when the additional action is needed (e.g specific
	 * tracking).
	 * Although it is no need of overwriting it so it doesn't throw an exception.
	 *
	 * @returns {void}
	 */
	onCollapseChanged() {},

	actions: {
		/**
		 * Toggle categories section
		 *
		 * @returns {void}
		 */
		collapsableToggle() {
			const collapsed = this.get('collapsed');

			this.onCollapseChanged(collapsed);

			this.set('collapsed', !collapsed);

		},
	}
});
