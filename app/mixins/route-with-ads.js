import Ember from 'ember';
import isInitialPageView from '../utils/initial-page-view';

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
		if (!this.get('fastboot.isFastBoot') && !isInitialPageView()) {
			window.wgNow = new Date();
		}
	}
});
