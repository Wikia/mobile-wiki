import localSettings from '../../config/localSettings';
import Logger from './Logger';

export const Comscore = {
		/**
		 * @param {string} vertical
		 * @returns {*}
		 */
		getC7Value(vertical) {
			return `wikiacsid_${vertical.toLowerCase()}`;
		},

		/**
		 * @param {string} requestUrl
		 * @param {string} c7Value
		 * @returns {string}
		 */
		getC7ParamAndValue(requestUrl, c7Value) {
			const paramAndValue = `${requestUrl}${requestUrl.indexOf('?') !== -1 ? '&' : '?'}` +
				`${localSettings.tracking.comscore.keyword}=${c7Value}`;

			return encodeURIComponent(paramAndValue);
		},

		/**
		 * @param {*} tracking
		 * @param {string} vertical
		 * @param {Hapi.Request} request
		 * @returns {void}
		 */
		handleResponse(tracking, vertical, request) {
			tracking.comscore.c7 = Comscore.getC7ParamAndValue(
				`http://${request.headers.host}/${request.url.path}`,
				Comscore.getC7Value(vertical)
			);

			tracking.comscore.c7Value = Comscore.getC7Value(vertical);
		}
	},
	Nielsen = {
		/**
		 * @param {*} tracking
		 * @param {string} vertical
		 * @param {string} dbName
		 * @param {boolean} enabled
		 * @returns {void}
		 */
		handleResponse(tracking, vertical, dbName, enabled) {
			tracking.nielsen.section = vertical;
			tracking.nielsen.subbrand = dbName;
			tracking.nielsen.enabled = enabled;
		}
	};

/**
 * @param {*} result
 * @param {Hapi.Request} request
 * @returns {void}
 */
export function handleResponse(result, request) {
	const tracking = localSettings.tracking;

	let vertical,
		dbName,
		nielsenEnabled;

	try {
		vertical = result.wikiVariables.tracking.vertical;
		dbName = result.wikiVariables.dbName;
		nielsenEnabled = result.wikiVariables.tracking.nielsen;
	} catch (error) {
		Logger.error('No vertical set for response');

		vertical = '';
	}

	Comscore.handleResponse(tracking, vertical, request);
	Nielsen.handleResponse(tracking, vertical, dbName, nielsenEnabled);

	// export tracking code to layout and front end code
	result.tracking = tracking;
}
