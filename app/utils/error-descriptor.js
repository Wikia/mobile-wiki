/**
 * This is a mix of useful parts from:
 * - https://github.com/janmisek/ember-types
 * - https://github.com/janmisek/ember-error-handler
 */
import Ember from 'ember';

const {NAME_KEY, Object: EmberObject, computed} = Ember;
const unknownFunction = 'UnknownFunction';
const unknownObject = 'UnknownObject';

const stringify = (value) => {
	try {
		value = String(value);
	} catch (e) {
		value = 'unrecognized';
	}
	return value;
};

const extractClassName = (subject) => {
	return subject[NAME_KEY] || subject.modelName || subject.name ||
		stringify(subject) || unknownFunction;
};

const extractInstanceName = (subject) => {
	return subject._debugContainerKey || subject.modelName ||
		(subject.constructor ? extractClassName(subject.constructor) : false) ||
		stringify(subject) || unknownObject;
};

const extractErrorName = (subject) => {
	if (typeof subject === 'function') {
		return `Class ${extractClassName(subject)}`;
	} else {
		return `Instance of ${extractInstanceName(subject)}`;
	}
};

export default EmberObject.extend({
	error: null,

	normalizedName: computed(function () {
		const error = this.get('error');
		return extractErrorName(error) || String(error) || 'Unknown error';
	}),

	normalizedMessage: computed(function () {
		const error = this.get('error');

		if (typeof error === 'undefined') {
			return 'undefined thrown as error';
		}

		if (error === null) {
			return 'null thrown as error';
		}

		if (typeof error === 'boolean') {
			return `boolean thrown as error (${error ? 'true' : 'false'})`;
		}

		if (typeof error === 'string' || typeof error === 'number') {
			return error;
		}

		return error.message ? error.message : this.get('normalizedName');
	}),

	normalizedStack: computed(function () {
		let stack = this.get('error.stack');

		const parsed = (stack || '').replace(new RegExp('\\r', 'g'), '').split('\n');
		const message = this.get('normalizedMessage');

		const firstLine = parsed[0];
		const doesStackIncludeMessage = firstLine && firstLine.indexOf(message) !== -1;

		if (!doesStackIncludeMessage) {
			parsed[0] = parsed[0] ? `${parsed[0]}:` : parsed[0];
			parsed[0] = parsed[0] + message;
			stack = parsed.join('\n');
		}

		return stack;
	}),

	additionalData: computed(function () {
		const namesUsed = [];
		const error = this.get('error');
		let collected = null;

		const getErrorName = (error) => {
			const root = error.name || 'error';
			let name;
			let index = 0;
			do {
				name = `${root}:${index}`;
				index++;
			} while (namesUsed.indexOf(name) !== -1);

			return name;
		};

		const collectAdditionalData = (error) => {
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
