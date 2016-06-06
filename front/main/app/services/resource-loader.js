import Ember from 'ember';

const {$, inject, Service} = Ember,
	{buildUrl} = M,
	typeCss = 'css';

/**
 * Helper class for loading CSS
 * @returns {void}
 */
function Css() {
}

export default Service.extend({
	ajax: inject.service(),
	assets: {
		portableInfoboxBuilderCss: {
			data: {
				controller: 'PortableInfoboxBuilderController',
				method: 'getAssets',
				format: 'json'
			},
			loaded: false,
			bodyClass: 'infobox-builder-body-wrapper',
			type: typeCss
		}
	},

	/**
	 * Loads resource for requested bundle, don't load if already loaded
	 *
	 * @param {string} assetsBundleName
	 * @returns {Ember.RSVP.Promise}
	 */
	load(assetsBundleName) {
		const assetsBundle = this.get('assets')[assetsBundleName];

		if (!assetsBundle) {
			throw new Error('Requested asset not found on avialable assets list');
		}

		if (assetsBundle.loaded === true) {
			return true;
		}

		if (!assetsBundle.type) {
			throw new Error('Missing type property in requested asset');
		}

		const loader = this.get('loaders')[assetsBundle.type];

		if (!loader) {
			throw new Error('Loader for provided type doesn\'t exist');
		}

		return loader.load(assetsBundle, this.get('ajax'));
	},

	loaders: {
		css: new Css()
	}
});

/**
 * Load CSS assets from MedaWiki
 * @param {Object} assetsBundle
 * @param {Object} ajax
 * @throws {Error}
 * @returns {Promise}
 */
Css.prototype.load = function (assetsBundle, ajax) {
	if (!assetsBundle.data) {
		throw new Error('Missing data property in requested asset');
	}

	return ajax.request(buildUrl({path: '/wikia.php'}), {
		data: assetsBundle.data
	}).then((data) => {
		if (data && data.css) {
			this.setupStyles(assetsBundle, data);
		} else {
			throw new Error('Invalid assets data was returned from MediaWiki API');
		}
	});
};

/**
 * Adds styles to the DOM
 * and optionally a class to the body element
 *
 * @param {Object} assetsBundle
 * @param {Object} serverResponse
 * @returns {void}
 */
Css.prototype.setupStyles = function (assetsBundle, serverResponse) {
	if (assetsBundle.bodyClass) {
		$('body').addClass(assetsBundle.bodyClass);
	}

	const html = serverResponse.css.map((url) => {
		return `<link type="text/css" rel="stylesheet" href="${url}">`;
	}).join('');

	this.appendToHead(html);

	assetsBundle.loaded = true;
};

Css.prototype.appendToHead = function (html) {
	$(html).appendTo('head');
};
