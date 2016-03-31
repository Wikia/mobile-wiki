/**
 * @typedef {Object} ClickStreamPayload
 * @property {object[]} events
 */

/**
 * @typedef {Object} PageParams
 * @property {boolean} enableSocialLogger
 * @property {string} socialLoggerUrl
 */

/**
 * @typedef {Object} XMLHttpRequest
 * @property {string} responseUrl
 */

/**
 * @enum {object} AuthLoggerLevels
 * @readonly
 */
const AuthLoggerLevels = {
	Emergency: 0,
	critical: 1,
	alert: 2,
	error: 3,
	warning: 4,
	notice: 5,
	info: 6,
	debug: 7
};

/**
 * @class AuthLogger
 *
 * @property {AuthLogger} instance
 * @property {boolean} isEnabled
 * @property {string} url
 */
export default class AuthLogger {
	/**
	 * @returns {void}
	 */
	constructor() {
		if (window.pageParams) {
			this.isEnabled = window.pageParams.enableSocialLogger;
			this.url = window.pageParams.socialLoggerUrl;
		}
	}

	/**
	 *
	 * @returns {AuthLogger}
	 */
	static getInstance() {
		if (!AuthLogger.instance) {
			AuthLogger.instance = new AuthLogger();
		}
		return AuthLogger.instance;
	}

	/**
	 * @param {Object} data
	 *
	 * @returns {void}
	 */
	log(data) {
		if (this.isEnabled) {
			const loggerXhr = new XMLHttpRequest(),
				clickStreamPayload = this.getClickStreamPayload(data);

			loggerXhr.open('POST', this.url, true);
			loggerXhr.setRequestHeader('Content-Type', 'application/json');
			loggerXhr.send(JSON.stringify(clickStreamPayload));
		}
	}

	/**
	 * @param {Object} data
	 *
	 * @returns {void}
	 */
	info(data) {
		data.level = AuthLoggerLevels.info;
		data.clientUrl = window.location.href;

		return this.log(data);
	}

	/**
	 * @param {Object} data
	 *
	 * @returns {ClickStreamPayload}
	 */
	getClickStreamPayload(data) {
		let events = [];

		if (Array.isArray(data)) {
			events = data;
		} else {
			events.push(data);
		}

		return {
			events
		};
	}

	/**
	 * @param {XMLHttpRequest} xhr
	 *
	 * @returns {void}
	 */
	xhrError(xhr) {
		this.log({
			level: AuthLoggerLevels.error,
			status: xhr.status,
			response: xhr.responseText,
			// Might give undefined in ie11
			heliosUrl: xhr.responseUrl,
			clientUrl: window.location.href
		});
	}
}
