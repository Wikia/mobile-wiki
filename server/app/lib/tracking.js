import localSettings from '../../config/localSettings';
import Logger from './logger';

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
		 * @param {object} config
		 * @returns {void}
		 */
		handleResponse(tracking, config) {
			tracking.ivw3.cmKey = config.cmKey || '';
			tracking.ivw3.countries = config.countries || [];
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
			tracking.nielsen.dbName = dbName;
			tracking.nielsen.enabled = config.enabled;
			tracking.nielsen.apid = config.apid;
		}
	},
	Ubisoft = {
		/**
		 * @param {object} tracking
		 * @param {object} trackingConfig
		 * @returns {void}
		 */
		handleResponse(tracking, trackingConfig) {
			tracking.ubisoft = {
				enabled: !!trackingConfig.ubisoft.enabled,
				url: trackingConfig.ubisoft.url
			};
		}
	};

/**
 * @param {*} result
 * @param {Hapi.Request} request
 * @returns {void}
 */
export function handleResponse(result, request) {
	const tracking = localSettings.tracking;

	let dbName,
		trackingConfig,
		vertical;

	try {
		dbName = result.wikiVariables.dbName || '';
		trackingConfig = result.wikiVariables.tracking || {};
	} catch (error) {
		Logger.error('Missing variable in wikiVariables');
	}
	vertical = trackingConfig.vertical || '';

	Comscore.handleResponse(tracking, vertical, request);
	IVW3.handleResponse(tracking, trackingConfig.ivw3 || {});
	Nielsen.handleResponse(tracking, vertical, dbName, trackingConfig.nielsen || {});
	Ubisoft.handleResponse(tracking, trackingConfig);

	// export tracking code to layout and front end code
	result.tracking = tracking;
}
