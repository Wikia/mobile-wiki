import Ember from 'ember';

const {Mixin, inject} = Ember;

export default Mixin.create({
	fastboot: inject.service(),
	initialPageView: inject.service(),

	/**
	 * Reset AdEngine variables before article load
	 *
	 * @returns {void}
	 */
	beforeModel() {
		this._super();

		const isInitialPageView = this.get('initialPageView').isInitialPageView();

		if (!this.get('fastboot.isFastBoot') && !isInitialPageView) {
			window.wgNow = new Date();
		}
	}
});
