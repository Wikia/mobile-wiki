import BaseConsumer from 'ember-error-handler/consumer/base-consumer';

export default BaseConsumer.extend({
	consume (descriptor) {
		if (typeof FastBoot !== 'undefined') {
			// TODO XW-3101 log descriptor and request details to Kibana
		}
	}
});
