define('mobile-wiki/services/logger', ['exports', 'mobile-wiki/config/environment', 'mobile-wiki/utils/error-descriptor', 'mobile-wiki/utils/extend'], function (exports, _environment, _errorDescriptor, _extend) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var EmberLogger = Ember.Logger,
	    Service = Ember.Service,
	    inject = Ember.inject;


	/**
  * Elastic Search doesn't play well with arrays of objects
  * Convert additionalData to an object with objects
  *
  * @param {Object} additionalData
  * @returns {Object}
  */
	var additionalDataSerializer = function additionalDataSerializer(additionalData) {
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
	var previousErrorSerializer = function previousErrorSerializer(previousError) {
		if (previousError && previousError.additionalData) {
			var serialized = Object.assign({}, previousError);
			serialized.additionalData = additionalDataSerializer(previousError.additionalData);
			return serialized;
		}

		return previousError;
	};

	exports.default = Service.extend({
		fastboot: inject.service(),
		wikiVariables: inject.service(),

		bunyanInstance: null,
		requestContext: null,

		init: function init() {
			if (this.get('fastboot.isFastBoot')) {
				this.setupRequestDetails();
				this.setupBunyan();
			}
		},
		setupRequestDetails: function setupRequestDetails() {
			var request = this.get('fastboot.request');
			var headers = request.get('headers');

			this.set('requestContext', {
				'@fields': {
					app_name: 'mobile-wiki',
					datacenter: _environment.default.wikiaDatacenter,
					environment: _environment.default.wikiaEnv,
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
		setupBunyan: function setupBunyan() {
			var bunyan = FastBoot.require('bunyan');
			var process = FastBoot.require('process');

			var instance = bunyan.createLogger({
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
		addContext: function addContext(object, message) {
			return (0, _extend.default)({
				'@message': message,
				event: object
			}, this.get('requestContext'));
		},
		extendError: function extendError(error, message) {
			var errorDescriptor = _errorDescriptor.default.create({ error: error });

			return (0, _extend.default)({
				'@message': 'FastBoot error - ' + message + ' - ' + errorDescriptor.get('normalizedMessage'),
				'@stack_trace': errorDescriptor.get('normalizedStack').substring(0, 500),
				event: {
					additionalData: additionalDataSerializer(error.additionalData),
					previous: previousErrorSerializer(error.previous)
				}
			}, this.get('requestContext'));
		},
		log: function log(logLevel, message, object) {
			if (this.get('fastboot.isFastBoot')) {
				var extendedObject = logLevel === 'error' ? this.extendError(object, message) : this.addContext(object, message);

				this.get('bunyanInstance')[logLevel](extendedObject, message);
			}

			EmberLogger[logLevel](message, object);
		},
		debug: function debug(message, object) {
			this.log('debug', message, object);
		},
		info: function info(message, object) {
			this.log('info', message, object);
		},
		warn: function warn(message, object) {
			this.log('warn', message, object);
		},
		error: function error(message, object) {
			this.log('error', message, object);
		}
	});
});