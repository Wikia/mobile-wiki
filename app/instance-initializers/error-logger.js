import {logError} from '../modules/event-logger';
import Ember from 'ember';

const whitelistErrorMessages = [
	'Attempt to use history.pushState() more than 100 times per 30.000000 seconds'
];

export function initialize(/* appInstance */) {
	if (typeof FastBoot !== 'undefined') {
		return;
	}
	Ember.onerror = function (error) {
		if (whitelistErrorMessages.indexOf(error.message) === -1) {
			logError('Ember.onerror', {
				message: error.message,
				stack: error.stack,
			});
		}

		// To be able to display it in console
		throw error;
	};
}

export default {
	after: 'config',
	name: 'error-logger',
	initialize
};
