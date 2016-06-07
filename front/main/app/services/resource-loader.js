import Ember from 'ember';
import assets from './config/resources';

const {$, inject, Service, RSVP} = Ember,
	{buildUrl} = M;

/**
 * Load CSS assets from MedaWiki
 * @param {Object} assetsBundle
 * @param {string} assetsBundleName
 * @param {Object} loaded
 * @param {Object} ajax
 * @throws {Error}
 * @returns {Promise}
 */
function loadCss(assetsBundle, assetsBundleName, loaded, ajax) {
	if (!assetsBundle.data) {
		return RSVP.reject(new Error('Missing data property in requested asset'));
	}

	/**
	 * @param {string} html
	 * @returns {void}
	 */
	function appendToHead(html) {
		$(html).appendTo('head');
	}

	/**
	 * Adds styles to the DOM
	 * and optionally a class to the body element
	 *
	 * @param {Object} assetsBundle
	 * @param {string} assetsBundleName
	 * @param {Object} loaded
	 * @param {Object} serverResponse
	 * @returns {void}
	 */
	function setupStyles(assetsBundle, assetsBundleName, loaded, serverResponse) {
		if (assetsBundle.bodyClass) {
			$('body').addClass(assetsBundle.bodyClass);
		}

		const html = serverResponse.css.map((url) => {
			return `<link type="text/css" rel="stylesheet" href="${url}">`;
		}).join('');

		appendToHead(html);

		loaded[assetsBundleName] = true;
	}

	return ajax.request(buildUrl({path: '/wikia.php'}), {
		data: assetsBundle.data
	}).then((data) => {
		if (data && data.css) {
			setupStyles(assetsBundle, assetsBundleName, loaded, data);
		} else {
			throw new Error('Invalid assets data was returned from MediaWiki API');
		}
	});
}

export default Service.extend({
	ajax: inject.service(),
	loaded: {},

	/**
	 * Loads resource for requested bundle, don't load if already loaded
	 *
	 * @param {string} assetsBundleName
	 * @returns {Ember.RSVP.Promise}
	 */
	load(assetsBundleName) {
		const assetsBundle = assets[assetsBundleName];

		if (!assetsBundle) {
			return RSVP.reject(new Error('Requested asset not found on avialable assets list'));
		}

		if (this.get('loaded')[assetsBundleName] === true) {
			return RSVP.resolve('Asset already loaded');
		}

		if (!assetsBundle.type) {
			return RSVP.reject(new Error('Missing type property in requested asset'));
		}

		const loader = this.get('loaders')[assetsBundle.type];

		if (!loader) {
			return RSVP.reject(new Error('Loader for provided type doesn\'t exist'));
		}

		return loader(assetsBundle, assetsBundleName, this.get('loaded'), this.get('ajax'));
	},

	loaders: {
		css: loadCss,
		js(assetsBundle, assetsBundleName, loaded) {
			return $.getScript(assetsBundle.path).then(() => {
				loaded[assetsBundleName] = true;
			});
		}
	}
});
