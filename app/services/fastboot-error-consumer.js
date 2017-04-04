import Ember from 'ember';
import BaseConsumer from 'ember-error-handler/consumer/base-consumer';
import extend from '../utils/extend';

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

			const error = extend({}, descriptor.get('error'));
			const errorWithStack = extend(error, {
				stack: descriptor.get('normalizedStack')
			});

			logger.error(
				errorWithStack,
				`FastBoot error: ${descriptor.get('normalizedMessage')}`
			);
		}

		return true;
	}
});
