if (typeof window.M === 'undefined') {
	window.M = {};
}
if (typeof window.M.tracker === 'undefined') {
	window.M.tracker = {};
}
/* eslint-disable no-console, max-depth */

/**
 * @typedef {Object} TrackerOptions
 * @property {string} name
 * @property {boolean} allowLinker
 * @property {number} sampleRate
 */

/**
 * @typedef {string|function} UniversalAnalyticsDimension
 */

/**
 * @typedef {Object<UniversalAnalyticsDimension>} UniversalAnalyticsDimensions
 */

/**
 * @typedef {Object} GAAccount
 * @property {string} id
 * @property {string} [prefix]
 * @property {number} sampleRate
 */

(function (M) {
	let tracked = [],
		createdAccounts = [],
		dimensions = {},
		dimensionsSynced = false,
		accounts;

	const pageDimensions = [3, 14, 19, 25],
		accountPrimary = 'primary',
		accountSpecial = 'special',
		accountAds = 'ads';

	/**
	 * We create new tracker instance every time mercury/utils/track #track or #trackPageView is called
	 * Google wants us to call methods below just once per account
	 *
	 * @param {string} id
	 * @param {string} prefix
	 * @param {Object} options
	 * @returns {void}
	 */
	function setupAccountOnce(id, prefix, options) {
		if (createdAccounts.indexOf(id) === -1) {
			ga('create', id, 'auto', options);
			ga(`${prefix}require`, 'linker');

			createdAccounts.push(id);
		}
	}

	/**
	 * Returns proper prefix for given account
	 *
	 * @param {GAAccount} account
	 * @returns {string}
	 */
	function getPrefix(account) {
		return account.prefix ? `${account.prefix}.` : '';
	}

	/**
	 * Initialize an additional account or property
	 *
	 * @param {string} trackerName - The name of the account as specified in localSettings
	 * @returns {void}
	 */
	function initAccount(trackerName) {
		const gaUserIdHash = M.prop('gaUserIdHash') || '',
			options = {
				name: '',
				allowLinker: true,
				sampleRate: accounts[trackerName].sampleRate,
				userId: (gaUserIdHash.length > 0 ? gaUserIdHash : null)
			};

		let prefix = '',
			trackerPrefix;

		// Primary account should not have a namespace prefix
		if (trackerName !== accountPrimary) {
			trackerPrefix = accounts[trackerName].prefix;
			prefix = `${trackerPrefix}.`;
			options.name = trackerPrefix;
		}

		setupAccountOnce(accounts[trackerName].id, prefix, options);

		ga(`${prefix}linker:autoLink`, ['wikia.com']);

		tracked.push(accounts[trackerName]);
	}

	/**
	 * Retrieves string value or invokes function for value
	 *
	 * @param {number} index
	 * @returns {string}
	 */
	function getDimension(index) {
		const dimension = dimensions[index];

		return typeof dimension === 'function' ? dimension() : dimension;
	}

	/**
	 * This function is being executed before each track and page view events.
	 * It checks if there were any changes to `UniversalAnalytics.dimensions`
	 * and it sends dimensions to all Universal Analytics tracker when necessary.
	 *
	 * That allows us to set dimensions in an initializer and fill the remaining
	 * values later, ie. from the API.
	 *
	 * @returns {void}
	 */
	function syncDimensions() {
		if (!dimensionsSynced) {
			tracked.forEach((account) => {
				const prefix = getPrefix(account);

				$.each(dimensions, (index) => {
					ga(`${prefix}set`, `dimension${index}`, getDimension(index));
				});
			});

			dimensionsSynced = true;
		}
	}

	/**
	 * @param {UniversalAnalyticsDimensions} dimensionsToSet
	 * @param {boolean} [overwrite=true] - overwrite all preexisting dimensions and unset ones not declared
	 * @returns {void}
	 */
	function setDimensions(dimensionsToSet, overwrite) {
		if (Object.keys(dimensionsToSet).length) {
			if (overwrite === true) {
				dimensionsSynced = false;
				dimensions = dimensionsToSet;
			} else {
				// copy old dimensions
				const oldDimensions = $.extend({}, dimensions);

				// extend dimensions
				$.extend(dimensions, dimensionsToSet);

				/**
				 * Compare old dimensions' and new dimensions' length.
				 * If it's not equal we can assume that there was a change
				 * and we need to re-sync dimensions.
				 * Also do not lose previous dimensionsSynced status.
				 */
				dimensionsSynced = dimensionsSynced &&
					(Object.keys(oldDimensions).length === Object.keys(dimensions).length);

				/**
				 * If new dimension array is not the same length as the old one,
				 * it's definitely different.
				 */
				if (dimensionsSynced) {
					/**
					 * Iterate trough new dimensions and compare its values
					 * with the old one. Result of this loop is a logical
					 * conjunction of equality of those values.
					 * Which, ultimately, tells us if new dimensions are
					 * different from the old ones and if we need a re-syncing.
					 */
					$.each(dimensions, (index, value) => {
						dimensionsSynced = dimensionsSynced && (oldDimensions[index] === value);
					});
				}
			}
		}
	}

	/**
	 * @param {number} dimension
	 * @param {UniversalAnalyticsDimension} value
	 * @returns {void}
	 */
	function setDimension(dimension, value) {
		if (typeof value !== 'undefined') {
			dimensions[dimension] = String(value);
			dimensionsSynced = false;
		}
	}

	/**
	 * Tracks an event, using the parameters native to the UA send() method
	 *
	 * @see {@link https://developers.google.com/analytics/devguides/collection/analyticsjs/method-reference}
	 *
	 * @param {string} category - Event category.
	 * @param {string} action - Event action.
	 * @param {string} label - Event label.
	 * @param {number} value - Event value. Has to be an integer.
	 * @param {boolean} nonInteractive - Whether event is non-interactive.
	 * @returns {void}
	 */
	function track(category, action, label, value, nonInteractive) {
		console.log(">>>>>>>>>>>>>>>>> AFTER TRACK <<<<<<<<<<<<<<<<<<<<<<<");

		syncDimensions();

		tracked.forEach((account) => {
			// skip over ads tracker (as it's handled in self.trackAds)
			if (account.prefix !== accountAds) {
				const prefix = getPrefix(account);

				ga(
					`${prefix}send`,
					{
						hitType: 'event',
						eventCategory: category,
						eventAction: action,
						eventLabel: label,
						eventValue: value,
						nonInteraction: nonInteractive
					}
				);
			}
		});
	}

	/**
	 * Tracks an ads-related event
	 * @see {@link https://developers.google.com/analytics/devguides/collection/analyticsjs/method-reference}
	 *
	 * @param {string} category - Event category.
	 * @param {string} action - Event action.
	 * @param {string} label - Event label.
	 * @param {number} value - Event value. Has to be an integer.
	 * @param {boolean} nonInteractive - Whether event is non-interactive.
	 * @returns {void}
	 */
	function trackAds(category, action, label, value, nonInteractive) {
		syncDimensions();

		ga(
			`${accounts[accountAds].prefix}.send`,
			{
				hitType: 'event',
				eventCategory: category,
				eventAction: action,
				eventLabel: label,
				eventValue: value,
				nonInteraction: nonInteractive
			}
		);
	}

	/**
	 * Extracts useful query params and its values from full query params string,
	 * returns empty string if any of accepted query params not found in given string.
	 *
	 * Examples:
	 * ?query=test&useskin=mercury -> ?query=test
	 * ?one=two&three=four&query=test&five=six -> ?query=test
	 * ?one=two&three=four -> ''
	 *
	 * @param {string} queryParamsString query params string
	 * @returns {string}
	 */
	function filterQueryParams(queryParamsString) {
		const acceptedParams = ['query'];

		const query = queryParamsString
			.replace(/^\?/, '')
			.split('&')
			.filter((param) => {
				return acceptedParams.indexOf(param.split('=')[0]) === 0;
			})
			.reduce((p, c) => c, '');

		return query ? `?${query}` : '';
	}

	/**
	 * Updates current page. For urls containing the query param 'query', updates them with this param.
	 * Query param 'query' is needed in GA specifically for search traffic tracking.
	 *
	 * from https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications :
	 * Note: if you send a hit that includes both the location and page fields and the path values are different,
	 * Google Analytics will use the value specified for the page field.
	 *
	 * @param {string} [url=false] - if not set, get current location from window
	 * @returns {void}
	 */
	function updateTrackedUrl(url) {
		const location = document.createElement('a');

		location.href = url || window.location.href;

		tracked.forEach((account) => {
			const prefix = getPrefix(account);

			// add query param to url if present
			ga(`${prefix}set`, 'page', location.pathname + filterQueryParams(location.search));
		});
	}

	/**
	 * Tracks the current page view
	 *
	 * overrideUrl is essential for UA pageview tracker which get's location
	 * from window on page load and never updates it (despite changing
	 * title) - all subsequent events including pageviews are tracked
	 * for original location.
	 *
	 * @param {UniversalAnalyticsDimensions} [uaDimensions]
	 * @param {string} [overrideUrl]
	 * @returns {void}
	 */
	function trackPageView(uaDimensions, overrideUrl) {
		console.log(">>>>>>>>>>>>>>>>> TRACK PV <<<<<<<<<<<<<<<<<<<<<<<");
		/**
		 * We have some dimensions that are changing per-page - those include
		 * articleType, namespace and so on. We can't unset once sent
		 * dimension, so we're resetting them by overwriting previous
		 * value by empty string.
		 *
		 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#require
		 */
		$.each(pageDimensions, function () {
			setDimension(this, '');
		});

		// set per-page dimensions if they were passed
		if (typeof uaDimensions === 'object') {
			$.each(uaDimensions, setDimension);
		}

		syncDimensions();
		updateTrackedUrl(overrideUrl);

		tracked.forEach((account) => {
			const prefix = getPrefix(account);

			ga(`${prefix}send`, 'pageview');
		});

		console.info('Track PageView: Universal Analytics');
	}

	/**
	 * Integrate Optimizely data with UA dimensions
	 *
	 * this function relies on external dependency (Optimizely)
	 * accessible via `window`.
	 * It's not ideal to put it here, but out UA dimensions relies
	 * on Optimizely - we're sending data about A/B tests set in Optimizely.
	 *
	 * @returns {void}
	 */
	function setDimensionsForOptimizelyExperiments() {
		/**
		 * @returns {boolean}
		 */
		function isOptimizelyLoadedAndActive() {
			const optimizely = window.optimizely;

			return optimizely &&
				optimizely.activeExperiments &&
				Array.isArray(optimizely.activeExperiments) &&
				optimizely.activeExperiments.length > 0 &&
				typeof optimizely.allExperiments === 'object' &&
				Object.keys(optimizely.allExperiments).length > 0 &&
				typeof optimizely.variationNamesMap === 'object' &&
				Object.keys(optimizely.variationNamesMap).length > 0;
		}

		const activeExperiments = isOptimizelyLoadedAndActive() ? window.optimizely.activeExperiments : null;

		// UA integration code is also used in MediaWiki app - if you change it here, change it there too:
		// https://github.com/Wikia/app/blob/dev/extensions/wikia/AnalyticsEngine/js/universal_analytics.js
		if (activeExperiments) {
			/**
			 * @param {string} experimentId
			 */
			activeExperiments.forEach((experimentId) => {
				if (
					optimizely.allExperiments.hasOwnProperty(experimentId) &&
					typeof optimizely.allExperiments[experimentId].universal_analytics === 'object'
				) {
					const dimension = optimizely.allExperiments[experimentId].universal_analytics.slot,
						experimentName = optimizely.allExperiments[experimentId].name,
						variationName = optimizely.variationNamesMap[experimentId];

					dimensions[dimension] = `Optimizely ${experimentName} (${experimentId}): ${variationName}`;
					dimensionsSynced = false;
				}
			});
		}
	}

	/**
	 * Integrate AbTest data with UA dimensions
	 *
	 * This function relies on external dependency (our in-house
	 * A/B testing framework called AbTest).
	 * It's not ideal to put it here, but out UA dimensions relies
	 * on AbTest - we're sending data about A/B tests set in AbTest.
	 *
	 * @returns {void}
	 */
	function setDimensionsForWikiaAbTest() {
		const AbTest = window.Wikia && window.Wikia.AbTest;

		if (AbTest) {
			const abList = AbTest.getExperiments(true);

			for (let abIndex = 0; abIndex < abList.length; abIndex++) {
				const abExp = abList[abIndex],
					abSlot = AbTest.getGASlot(abExp.name);

				if (abExp && abExp.flags && abExp.flags.ga_tracking) {
					// GA Slots 40-49 are reserved for our AB Testing tool. Anything outside that
					// range could potentially overwrite something that we don't want to
					if (abSlot >= 40 && abSlot <= 49) {
						const noGroup = abList.nouuid ? 'NOBEACON' : 'NOT_IN_ANY_GROUP';

						dimensions[abSlot] = abExp.group ? abExp.group.name : noGroup;
						dimensionsSynced = false;
					}
				}
			}
		}
	}

	/**
	 * @param {UniversalAnalyticsDimensions} dimensions
	 * @returns {boolean}
	 */
	function initialize(dimensions) {
		console.log(">>>>>>>>>>>>>>>>> INITIALIZE <<<<<<<<<<<<<<<<<<<<<<<");
		if (typeof dimensions === 'undefined') {
			console.log('Cannot initialize UA; please provide dimensions');
			return false;
		}
		if (tracked.length) {
			console.log('Cannot initialize UA mutltiple times.');
			return false;
		}

		setDimensions(dimensions);
		setDimensionsForOptimizelyExperiments();
		setDimensionsForWikiaAbTest();

		accounts = M.prop('tracking.ua');

		initAccount(accountPrimary);
		initAccount(accountAds);

		if (M.prop('isGASpecialWiki') || Mercury.wiki.isGASpecialWiki) {
			initAccount(accountSpecial);
		}

		return true;
	}

	/**
	 * @returns {void}
	 */
	function destroy() {
		tracked = [];
		createdAccounts = [];
		dimensionsSynced = false;
	}

	/**
	 * @returns {boolean}
	 */
	function getDimensionsSynced() {
		return dimensionsSynced;
	}

	// API
	M.tracker.UniversalAnalytics = {
		initialize,
		destroy,
		setDimension,
		track,
		trackAds,
		trackPageView,
		// expose internals for unit test
		_setDimensions: setDimensions,
		_getDimensionsSynced: getDimensionsSynced,
		_updateTrackedUrl: updateTrackedUrl,
		_filterQueryParams: filterQueryParams,
		_dimensions: dimensions,
	};
})(M);
