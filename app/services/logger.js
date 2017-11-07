import Service, {inject as service} from '@ember/service';
import config from '../config/environment';
import ErrorDescriptor from '../utils/error-descriptor';
import extend from '../utils/extend';

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
	fastboot: service(),
	wikiVariables: service(),

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
		const process = FastBoot.require('process');

		const instance = bunyan.createLogger({
			appname: 'mobile-wiki',
			name: 'mobile-wiki',
			loggerName: 'services/logger.js',
			streams: [{
				level: 'warn',
				stream: process.stdout
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

	log(logLevel, message, object) {
		if (this.get('fastboot.isFastBoot')) {
			const extendedObject = logLevel === 'error' ?
				this.extendError(object, message) :
				this.addContext(object, message);

			this.get('bunyanInstance')[logLevel](extendedObject, message);
		} else {
			// eslint-disable-next-line no-console
			console[logLevel](message, object);
		}
	},

	debug(message, object) {
		this.log('debug', message, object);
	},

	info(message, object) {
		this.log('info', message, object);
	},

	warn(message, object) {
		this.log('warn', message, object);
	},

	error(message, object) {
		this.log('error', message, object);
	}
});
