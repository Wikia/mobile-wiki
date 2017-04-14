import Ember from 'ember';
import BaseConsumer from 'ember-error-handler/consumer/base-consumer';
import extend from '../utils/extend';
import {DontLogMeError} from '../utils/errors';

const {inject} = Ember;

/**
 * Elastic Search doesn't play well with arrays of objects
 * Convert additionalData to an object with objects
 *
 * @param {Object} additionalData
 * @returns {Object}
 */
const additionalDataSerializer = (additionalData) => {
	if (additionalData && Array.isArray(additionalData)) {
		return Object.assign({}, additionalData);
	}

	return additionalData;
};

/**
 * Elastic Search doesn't play well with arrays of objects
 * Convert previousError.additionalData to an object with objects
 *
 * @param {Object} previousError
 * @returns {Object}
 */
const previousErrorSerializer = (previousError) => {
	if (previousError && previousError.additionalData) {
		const serialized = Object.assign({}, previousError);
		serialized.additionalData = additionalDataSerializer(previousError.additionalData);
		return serialized;
	}

	return previousError;
};

export default BaseConsumer.extend({
	fastboot: inject.service(),

	consume(descriptor) {
		const fastboot = this.get('fastboot');

		if (fastboot.get('isFastBoot')) {
			// TODO XW-3198
			// Don't log special type of errors. Currently we use them hack Ember and stop executing application
			if (descriptor.get('error') instanceof DontLogMeError) {
				return true;
			}

			const error = extend({}, descriptor.get('error'));
			const errorWithStack = extend(error, {
				stack: descriptor.get('normalizedStack')
			});

			const bunyan = FastBoot.require('bunyan');
			const BunyanSyslog = FastBoot.require('bunyan-syslog');
			// TODO we probably shouldn't create new instance on every error
			// On the other hand, doesn't the app crash on the first one anyway?
			const logger = bunyan.createLogger({
				appname: 'mobile-wiki',
				name: 'mobile-wiki',
				serializers: {
					additionalData: additionalDataSerializer,
					previous: previousErrorSerializer
				},
				streams: [{
					level: 'warn',
					type: 'raw',
					stream: BunyanSyslog.createBunyanStream({
						facility: BunyanSyslog.local0,
						type: 'sys'
					})
				}]
			});

			logger.error(
				errorWithStack,
				`FastBoot error: ${descriptor.get('normalizedMessage')}`
			);
		}

		return true;
	}
});
