import Ember from 'ember';
import BaseErrorComponent from 'ember-error-handler/components/ember-error-handler/wsod-screen';

const {computed, inject, observer} = Ember;

export default BaseErrorComponent.extend({
	fastboot: inject.service(),

	descriptor: computed.reads('descriptors.firstObject'),

	additionalData: computed(function () {
		const additionalData = this.get('descriptor.additionalData');

		return additionalData ? JSON.stringify(additionalData, null, 1) : null;
	}),

	// descriptor is not available on init(), so we use observer instead
	setStatusCode: observer('descriptor', function () {
		const fastboot = this.get('fastboot');
		const code = parseInt(this.get('descriptor.error.code'), 10) || 503;

		if (fastboot.get('isFastBoot')) {
			if (code >= 400) {
				fastboot.set('response.statusCode', code);
			}

			if (code >= 500) {
				fastboot.get('shoebox').put('serverError', true);
			}
		}
	})
});
