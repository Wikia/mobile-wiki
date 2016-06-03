import Ember from 'ember';

const {$, inject, Service} = Ember;
const {buildUrl} = M;

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
			bodyClass: 'infobox-builder-body-wrapper'
		}
	},

	/**
	 * Loads assets from MediaWiki
	 *
	 * @param {string} assetsBundleName
	 * @returns {Ember.RSVP.Promise}
	 */
	load(assetsBundleName) {
		const assetsBundle = this.get('assets')[assetsBundleName];

		if (!assetsBundle) {
			throw new Error('Requested asset not found on avialable assets list');
		}

		if (!assetsBundle.data) {
			throw new Error('Missing data property in requested asset');
		}

		if (assetsBundle.loaded === true) {
			return true;
		}

		return this.get('ajax').request(buildUrl({path: '/wikia.php'}), {
			data: assetsBundle.data
		}).then((data) => {
			if (data && data.css) {
				this.setupStyles(assetsBundle, data);
				return data;
			} else {
				throw new Error('Invalid assets data was returned from MediaWiki API');
			}
		});
	},

	/**
	 * Adds styles to the DOM
	 * and optionally a class to the body element
	 *
	 * @param {Object} assetsBundle
	 * @param {Object} serverResponse
	 * @returns {void}
	 */
	setupStyles(assetsBundle, serverResponse) {
		if (assetsBundle.bodyClass) {
			$('body').addClass(assetsBundle.bodyClass);
		}

		const html = serverResponse.css.map((url) => {
			return `<link type="text/css" rel="stylesheet" href="${url}">`;
		}).join('');

		$(html).appendTo('head');

		assetsBundle.loaded = true;
	}
});
