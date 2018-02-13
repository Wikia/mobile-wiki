import {Promise} from 'rsvp';

export const assetUrls = {
	styles: '/mobile-wiki/assets/jwplayer/index.css',
	script: '/mobile-wiki/assets/jwplayer/wikiajwplayer.js'
};

/**
 * @class JWPlayerAssets
 */
class JWPlayerAssets {
	constructor() {
		this.wasStyleLoadInitialized = false;
		this.scriptsPromise = null;
	}

	loadStyles() {
		if (!this.wasStyleLoadInitialized) {
			$(`<link rel="stylesheet" href="${assetUrls.styles}">`)
				.appendTo('head');
			this.wasStyleLoadInitialized = true;
		}
	}

	loadScripts() {
		if (!this.scriptsPromise) {
			this.scriptsPromise = new Promise((resolve) => {
				window.M.loadScript(assetUrls.script, true, (data) => {
					resolve(data);
				});
			});
		}

		return this.scriptsPromise;
	}

	load() {
		this.loadStyles();

		return this.loadScripts();
	}
}

export default new JWPlayerAssets();
