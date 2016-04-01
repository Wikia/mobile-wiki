import Ember from 'ember';

export default Ember.Mixin.create({
	/**
	 * Reset AdEngine variables before article load
	 *
	 * @returns {void}
	 */
	beforeModel() {
		this._super();
		if (!M.prop('initialPageView')) {
			window.wgNow = new Date();
		}
	}
});
