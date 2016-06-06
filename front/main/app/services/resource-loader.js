import Ember from 'ember';

const {$, inject, Service, RSVP} = Ember,
	{buildUrl} = M,
	typeCss = 'css',
	typeJs = 'js';

/**
 * Helper class for loading CSS
 * @returns {void}
 */
function Css() {
}

/**
 * Helper class for loading JS
 * @returns {void}
 */
function Js() {
}

export default Service.extend({
	ajax: inject.service(),
	assets: {
		pontoJs: {
			path: '/front/main/assets/vendor/ponto/ponto.js',
			loaded: false,
			type: typeJs
		},
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
			return RSVP.reject(new Error('Requested asset not found on avialable assets list'));
		}

		if (assetsBundle.loaded === true) {
			return RSVP.resolve('Asset already loaded');
		}

		if (!assetsBundle.type) {
			return RSVP.reject(new Error('Missing type property in requested asset'));
		}

		const loader = this.get('loaders')[assetsBundle.type];

		if (!loader) {
			return RSVP.reject(new Error('Loader for provided type doesn\'t exist'));
		}

		return loader.load(assetsBundle, this.get('ajax'));
	},

	loaders: {
		css: new Css(),
		js: new Js()
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
		return RSVP.reject(new Error('Missing data property in requested asset'));
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


/**
 * Load JS assets from path
 * @param {Object} assetsBundle
 * @returns {Promise}
 */
Js.prototype.load = function (assetsBundle) {
	return Ember.$.getScript(assetsBundle.path).then(() => {
		assetsBundle.loaded = true;
	});
};
