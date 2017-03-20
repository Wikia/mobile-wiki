import Ember from 'ember';
import config from '../config/environment';
import request from 'ember-ajax/request';
import {isTimeoutError} from 'ember-ajax/errors';

const {
	Logger,
} = Ember;

export function initialize(applicationInstance) {
	const fastboot = applicationInstance.lookup('service:fastboot'),
		currentUser = applicationInstance.lookup('service:current-user');

	if (fastboot.get('isFastBoot')) {
		const accessToken = fastboot.get('request.cookies.access_token');

		if (accessToken) {
			request(config.helios.internalUrl, {
				data: {
					code: accessToken
				},
				timeout: config.helios.timeout,
				error: false
			}).then((data) => {
				fastboot.get('shoebox').put('userId', data.user_id);
				currentUser.initializeUserData(data.user_id);
			}).catch((reason) => {
				if (isTimeoutError(reason)) {
					Logger.error('Helios timeout error: ', reason);
				} else if (reason.errors && reason.errors[0].status == 401) {
					Logger.info('Token not authorized by Helios: ', reason);
				} else {
					Logger.error('Helios connection error: ', reason);
				}
			})
		}
	} else {
		const userId = fastboot.get('shoebox').retrieve('userId');

		if (userId) {
			currentUser.initializeUserData(userId);
		}
	}
}

export default {
	after: 'config',
	name: 'user',
	initialize
};
