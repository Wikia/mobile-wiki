import Ember from 'ember';
import BaseConsumer from 'ember-error-handler/consumer/base-consumer';

const {inject} = Ember;

export default BaseConsumer.extend({
	fastboot: inject.service(),

	consume(descriptor) {
		const fastboot = this.get('fastboot');

		if (fastboot.get('isFastBoot')) {
			const bunyan = FastBoot.require('bunyan');
			const BunyanSyslog = FastBoot.require('bunyan-syslog');
			// TODO we probably shouldn't create new instance on every error
			// On the other hand, doesn't the app crash on the first one anyway?
			const logger = bunyan.createLogger({
				appname: 'mobile-wiki',
				name: 'mobile-wiki',
				streams: [{
					level: 'warn',
					type: 'raw',
					stream: BunyanSyslog.createBunyanStream({
						facility: BunyanSyslog.local0,
						type: 'sys'
					})
				}]
			});

			logger.error(descriptor);
		}

		return true;
	}
});
