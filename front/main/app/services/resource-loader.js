import Ember from 'ember';
import assets from './config/resources';

const {$, inject, Service, RSVP} = Ember,
	assetJustAddedStatusName = 'Styles freshly added to DOM',
	assetAlreadyLoadedStatusName = 'Asset already loaded';

export default Service.extend({
	ajax: inject.service(),
	assetJustAddedStatusName,
	assetAlreadyLoadedStatusName,
	loaded: {},

	/**
	 * Loads resource for requested bundle, don't load if already loaded
	 *
	 * @param {string} assetsBundleName
	 * @param {string} assetsBundle Optional bundle config - if not present, config for provided name
	 *        is fetched from assets (config/resources)
	 * @returns {Ember.RSVP.Promise}
	 */
	load(assetsBundleName, assetsBundle) {
		if (!assetsBundle) {
			assetsBundle = assets[assetsBundleName];
		}

		if (this.get('loaded')[assetsBundleName] === true) {
			return RSVP.resolve(assetAlreadyLoadedStatusName);
		}

		if (!assetsBundle) {
			return RSVP.reject(new Error('Requested asset not found on avialable assets list'));
		}

		if (!assetsBundle.paths) {
			return RSVP.reject(new Error('Missing paths property in requested asset'));
		}

		if (typeof assetsBundle.paths.map !== 'function') {
			return RSVP.reject(new Error('Provided paths property should be an array'));
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
		/**
		 * Adds styles to the DOM
		 * and optionally a class to the body element
		 *
		 * @param {Object} assetsBundle
		 * @param {string} assetsBundleName
		 * @param {Object} loaded
		 * @returns {void}
		 */
		css(assetsBundle, assetsBundleName, loaded) {
			const html = assetsBundle.paths.map((url) => {
				return `<link type="text/css" rel="stylesheet" href="${url}">`;
			}).join('');

			$(html).appendTo('head');

			loaded[assetsBundleName] = true;
			return RSVP.resolve(assetJustAddedStatusName);
		},
		js(assetsBundle, assetsBundleName, loaded) {
			// return RSVP.hash(promises)
			// TODO support all array items
			return $.getScript(assetsBundle.paths[0]).then(() => {
				loaded[assetsBundleName] = true;
			});
		}
	},
});
