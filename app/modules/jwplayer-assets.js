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
			const styles = document.createElement('link');

			styles.rel = 'stylesheet';
			styles.href = assetUrls.styles;
			document.head.appendChild(styles);

			this.wasStyleLoadInitialized = true;
		}
	}

	loadScripts() {
		if (!this.scriptsPromise) {
			this.scriptsPromise = new Promise((resolve) => {
				window.M.loadScript(assetUrls.script, true, (data) => {
					resolve(data);
				}, 'anonymous');
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
