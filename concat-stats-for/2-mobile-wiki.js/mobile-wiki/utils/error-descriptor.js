define('mobile-wiki/utils/error-descriptor', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var EmberObject = Ember.Object;
	var computed = Ember.computed;
	var NAME_KEY = Ember.NAME_KEY;

	var unknownFunction = 'UnknownFunction';
	var unknownObject = 'UnknownObject';

	var stringify = function stringify(value) {
		try {
			value = String(value);
		} catch (e) {
			value = 'unrecognized';
		}
		return value;
	};

	var extractClassName = function extractClassName(subject) {
		return subject[NAME_KEY] || subject.modelName || subject.name || stringify(subject) || unknownFunction;
	};

	var extractInstanceName = function extractInstanceName(subject) {
		return subject._debugContainerKey || subject.modelName || (subject.constructor ? extractClassName(subject.constructor) : false) || stringify(subject) || unknownObject;
	};

	var extractErrorName = function extractErrorName(subject) {
		if (typeof subject === 'function') {
			return 'Class ' + extractClassName(subject);
		} else {
			return 'Instance of ' + extractInstanceName(subject);
		}
	};

	exports.default = EmberObject.extend({
		error: null,

		normalizedName: computed(function () {
			var error = this.get('error');
			return extractErrorName(error) || String(error) || 'Unknown error';
		}),

		normalizedMessage: computed(function () {
			var error = this.get('error');

			if (typeof error === 'undefined') {
				return 'undefined thrown as error';
			}

			if (error === null) {
				return 'null thrown as error';
			}

			if (typeof error === 'boolean') {
				return 'boolean thrown as error (' + (error ? 'true' : 'false') + ')';
			}

			if (typeof error === 'string' || typeof error === 'number') {
				return error;
			}

			return error.message ? error.message : this.get('normalizedName');
		}),

		normalizedStack: computed(function () {
			var stack = this.get('error.stack');

			var parsed = (stack || '').replace(new RegExp('\\r', 'g'), '').split('\n');
			var message = this.get('normalizedMessage');

			var firstLine = parsed[0];
			var doesStackIncludeMessage = firstLine && firstLine.indexOf(message) !== -1;

			if (!doesStackIncludeMessage) {
				parsed[0] = parsed[0] ? parsed[0] + ':' : parsed[0];
				parsed[0] += message;
				stack = parsed.join('\n');
			}

			return stack;
		}),

		additionalData: computed(function () {
			var namesUsed = [];
			var error = this.get('error');
			var collected = null;

			var getErrorName = function getErrorName(error) {
				var root = error.name || 'error';
				var name = void 0;
				var index = 0;
				do {
					name = root + ':' + index;
					index += 1;
				} while (namesUsed.indexOf(name) !== -1);

				return name;
			};

			var collectAdditionalData = function collectAdditionalData(error) {
				if (error && error.additionalData) {
					collected = collected || {};
					collected[getErrorName(error)] = error.additionalData;
					if (error.previous) {
						collectAdditionalData(error.previous);
					}
				}
			};

			collectAdditionalData(error);

			return collected;
		})
	});
});