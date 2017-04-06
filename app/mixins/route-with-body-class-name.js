import Ember from 'ember';

const {Mixin, $, inject, on} = Ember;

export default Mixin.create({
	fastboot: inject.service(),

	addBodyClassOnActivate: on('activate', function () {
		const bodyClassNames = this.get('bodyClassNames') || [];

		if (!this.get('fastboot.isFastBoot')) {
			$('body').addClass(bodyClassNames.join(' '));
		}
	}),

	removeBodyClassOnDeactivate: on('deactivate', function () {
		const bodyClassNames = this.get('bodyClassNames') || [];

		if (!this.get('fastboot.isFastBoot')) {
			$('body').removeClass(bodyClassNames.join(' '));
		}
	})
});
