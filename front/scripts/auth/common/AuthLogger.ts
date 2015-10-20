/**
 * ClickStreamPayload
 * @typedef {object} ClickStreamPayload
 * @property {Object[]} events
 */
interface ClickStreamPayload {
	events: any[];
}

/**
 * PageParams
 * @typedef {object} PageParams
 * @property {boolean} enableAuthLogger
 * @property {string} authLoggerUrl
 */
interface PageParams {
	enableAuthLogger: boolean;
	authLoggerUrl: string;
}

/**
 * XMLHttpRequest
 * @typedef {object} XMLHttpRequest
 * @property {string} responseUrl
 */
interface XMLHttpRequest {
	responseUrl: string;
}

/**
 * @readonly
 * @enum {object}
 */
enum AuthLoggerLevels {
	Emergency,
	critical,
	alert,
	error,
	warning,
	notice,
	info,
	debug
}

/**
 * @class AuthLogger
 */
class AuthLogger {
	static instance: AuthLogger;
	isEnabled: boolean = false;
	url: string;

	/**
	 * @constructs AuthLogger
	 */
	constructor () {
		if (window.pageParams) {
			this.isEnabled = window.pageParams.enableAuthLogger;
			this.url = window.pageParams.authLoggerUrl;
		}
	}

	/**
	 * @static
	 *
	 * @returns {AuthLogger}
	 */
	static getInstance(): AuthLogger {
		if (!AuthLogger.instance) {
			AuthLogger.instance = new AuthLogger();
		}
		return AuthLogger.instance;
	}

	/**
	 * @param {object} data
	 *
	 * @returns {void}
	 */
	public log(data: any): void {
		if (this.isEnabled) {
			var loggerXhr: XMLHttpRequest = new XMLHttpRequest(),
				clickStreamPayload: ClickStreamPayload = this.getClickStreamPayload(data);
			loggerXhr.open('POST', this.url, true);
			loggerXhr.setRequestHeader('Content-Type', 'application/json');
			loggerXhr.send(
				JSON.stringify(clickStreamPayload)
			);
		}
	}

	/**
	 * @param {object} data
	 *
	 * @returns {ClickStreamPayload}
	 */
	private getClickStreamPayload(data: any): ClickStreamPayload {
		var events: any[] = [];

		if (typeof data === 'array') {
			events = data;
		} else {
			events.push(data);
		}

		return {
			events: events
		};
	}

	/**
	 * @param {XMLHttpRequest} xhr
	 *
	 * @returns {void}
	 */
	public xhrError(xhr: XMLHttpRequest): void {
		this.log({
			level: AuthLoggerLevels.error,
			status: xhr.status,
			response: xhr.responseText,
			//Might give undefined in ie11
			heliosUrl: xhr.responseUrl,
			clientUrl: window.location.href
		});
	}
}
