import Ember from 'ember';
import assets from './config/resources';

const {$, inject, Service, RSVP} = Ember,
	assetJustAddedStatusName = 'Styles freshly added to DOM',
	assetAlreadyLoadedStatusName = 'Asset already loaded';

/**
 * Call load method with bundle name you want to load.
 * Available bundles are listed in config/resources.
 * If you want to provide your own bundle please provide assetsBundle param.
 *
 * Service loads css and js files from url of path and keeps information of it's load status
 * so same assets aren't requested multiple times.
 *
 * example assetsBundle:
 * {
 *   paths: ['/front/main/assets/vendor/ponto/ponto.js'],
 *   type: 'js'
 * }
 */
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
	 *        should contain fields:
	 *        * paths (array of paths to load)
	 *        * type (loader type: css/js)
	 * @returns {Ember.RSVP.Promise}
	 */
	load(assetsBundleName, assetsBundle) {
		if (!assetsBundle) {
			assetsBundle = assets[assetsBundleName];
		}

		if (this.get(`loaded.${assetsBundleName}`) === true) {
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

		return loader(assetsBundle.paths, this.get('ajax')).then(() => {
			this.set(`loaded.${assetsBundleName}`, true);
			return RSVP.resolve(assetJustAddedStatusName);
		});
	},

	loaders: {
		/**
		 * Adds styles to the DOM.
		 * Please use load method providing {type: 'css'} in assetsBundle to invoke this loader
		 *
		 * @param {array} assetsPaths array of assets paths
		 * @returns {Ember.RSVP.Promise}
		 */
		css(assetsPaths) {
			const html = assetsPaths.map((url) => {
				return `<link type="text/css" rel="stylesheet" href="${url}">`;
			}).join('');

			$(html).appendTo('head');

			return RSVP.resolve();
		},
		/**
		 * Loads and executes scripts from assetsBundle list.
 		 * Please use load method providing {type: 'js'} in assetsBundle to invoke this loader
		 *
		 * @param {array} assetsPaths array of assets paths
		 * @returns {Ember.RSVP.Promise}
		 */
		js(assetsPaths) {
			const promises = assetsPaths.map((url) => {
				return $.getScript(url);
			});

			return RSVP.hash(promises);
		}
	},
});
