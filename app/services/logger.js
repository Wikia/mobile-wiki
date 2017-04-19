import Ember from 'ember';
import config from '../config/environment';
import ErrorDescriptor from '../utils/error-descriptor';
import {DontLogMeError} from '../utils/errors';
import extend from '../utils/extend';

const {Logger: EmberLogger, Service, inject} = Ember;

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

export default Service.extend({
	fastboot: inject.service(),
	wikiVariables: inject.service(),

	bunyanInstance: null,
	requestContext: null,

	init() {
		if (this.get('fastboot.isFastBoot')) {
			this.setupRequestDetails();
			this.setupBunyan();
		}
	},

	setupRequestDetails() {
		const request = this.get('fastboot.request');
		const headers = request.get('headers');

		this.set('requestContext', {
			'@fields': {
				app_name: 'mobile-wiki',
				datacenter: config.wikiaDatacenter,
				environment: config.wikiaEnv,
				http_url_domain: request.get('host'),
				http_url_path: request.get('path'),
				client_beacon_id: headers.get('x-beacon'),
				logged_in: headers.get('x-logged-in'),
				trace_id: headers.get('x-trace-id'),
				user_agent: headers.get('user-agent'),
				wiki_dbname: this.get('wikiVariables.dbName'),
				wiki_id: this.get('wikiVariables.id')
			}
		});
	},

	setupBunyan() {
		const bunyan = FastBoot.require('bunyan');
		const BunyanSyslog = FastBoot.require('bunyan-syslog');
		const instance = bunyan.createLogger({
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

		this.set('bunyanInstance', instance);
	},

	addContext(object, message) {
		return extend({
			'@message': message,
			event: object
		}, this.get('requestContext'));
	},

	extendError(error, message) {
		const errorDescriptor = ErrorDescriptor.create({error});

		return extend({
			'@message': `FastBoot error - ${message} - ${errorDescriptor.get('normalizedMessage')}`,
			'@stack_trace': errorDescriptor.get('normalizedStack').substring(0, 500),
			event: {
				additionalData: additionalDataSerializer(error.additionalData),
				previous: previousErrorSerializer(error.previous)
			}
		}, this.get('requestContext'));
	},

	debug(message, object) {
		if (this.get('fastboot.isFastBoot')) {
			this.get('bunyanInstance').debug(this.addContext(object, message), message);
		}

		EmberLogger.debug(message, object);
	},

	info(message, object) {
		if (this.get('fastboot.isFastBoot')) {
			this.get('bunyanInstance').info(this.addContext(object, message), message);
		}

		EmberLogger.info(message, object);
	},

	warn(message, object) {
		if (this.get('fastboot.isFastBoot')) {
			this.get('bunyanInstance').warn(this.addContext(object, message), message);
		}

		EmberLogger.warn(message, object);
	},

	error(message, object) {
		if (this.get('fastboot.isFastBoot')) {
			this.get('bunyanInstance').error(this.extendError(object, message), message);
		}

		EmberLogger.error(message, object);
	}
});
