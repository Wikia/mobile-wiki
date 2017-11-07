import Ember from 'ember';
const { RSVP } =  Ember;

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
			$(`<link rel="stylesheet" href="${assetUrls.styles}" crossorigin="anonymous">`)
				.appendTo('head');
			this.wasStyleLoadInitialized = true;
		}
	}

	loadScripts() {
		if (!this.scriptsPromise) {
			this.scriptsPromise = new RSVP.Promise((resolve) => {
				window.M.loadScript(assetUrls.script, true, (data) => {
					resolve(data);
				}, 'anonymous');
			});
		}

		return this.scriptsPromise;
	}
}

const jwPlayerAssets = new JWPlayerAssets();

export default jwPlayerAssets;
