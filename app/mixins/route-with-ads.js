import Ember from 'ember';

const {Mixin, inject} = Ember;

export default Mixin.create({
	fastboot: inject.service(),

	/**
	 * Reset AdEngine variables before article load
	 *
	 * @returns {void}
	 */
	beforeModel() {
		this._super();
		if (!this.get('fastboot.isFastBoot') && !M.initialPageView) {
			window.wgNow = new Date();
		}
	}
});
