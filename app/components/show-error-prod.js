import Ember from 'ember';
import BaseErrorComponent from 'ember-error-handler/components/ember-error-handler/wsod-screen';

const {computed, inject, observer} = Ember;

export default BaseErrorComponent.extend({
	fastboot: inject.service(),

	descriptor: computed.reads('descriptors.firstObject'),

	setStatusCode: observer('descriptor', function () {
		const fastboot = this.get('fastboot');
		const code = this.get('descriptor.error.code');

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
