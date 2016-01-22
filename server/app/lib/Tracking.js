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
	IVW3 = {
		/**
		 * @param {*} tracking
		 * @param {string} vertical
		 * @param {object} config
		 * @returns {void}
		 */
		handleResponse(tracking, vertical, config) {
			tracking.ivw3.vertical = vertical;
			tracking.ivw3.enabled = config.enabled;
			tracking.ivw3.countries = config.countries;
		}
	},
	Nielsen = {
		/**
		 * @param {*} tracking
		 * @param {string} vertical
		 * @param {string} dbName
		 * @param {object} config
		 * @returns {void}
		 */
		handleResponse(tracking, vertical, dbName, config) {
			tracking.nielsen.section = vertical;
			tracking.nielsen.subbrand = dbName;
			tracking.nielsen.enabled = config.enabled;
		}
	};

/**
 * @param {*} result
 * @param {Hapi.Request} request
 * @returns {void}
 */
export function handleResponse(result, request) {
	const tracking = localSettings.tracking;

	let dbName = '',
		vertical = '',
		ivw3Config = {},
		nielsenConfig = {};

	try {
		dbName = result.wikiVariables.dbName;
		vertical = result.wikiVariables.tracking.vertical;
		ivw3Config = result.wikiVariables.tracking.ivw3;
		nielsenConfig = result.wikiVariables.tracking.nielsen;
	} catch (error) {
		Logger.error('Missing tracking variable in wikiVariables');
	}

	Comscore.handleResponse(tracking, vertical, request);
	IVW3.handleResponse(tracking, vertical, ivw3Config);
	Nielsen.handleResponse(tracking, vertical, dbName, nielsenConfig);

	// export tracking code to layout and front end code
	result.tracking = tracking;
}
