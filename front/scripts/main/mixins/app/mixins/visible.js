/**
 * Mixin that sends 'onVisible' action when element appears on screen for the first time.
 *
 */

App.VisibleMixin = Em.Mixin.create({
	/**
	 * @returns {void}
	 */
	init() {
		this._super();

		App.VisibilityStateManager.add(this);
	}
});
