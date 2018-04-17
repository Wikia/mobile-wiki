import {Promise} from 'rsvp';

export const assetUrls = {
	adEngineScript: '/mobile-wiki/assets/adengine/ad-engine.global.js',
	adProductsScript: '/mobile-wiki/assets/adengine/ad-products.global.js',
	geoScript: '/mobile-wiki/assets/adengine/geo.global.js',
	adProductsStyles: '/mobile-wiki/assets/adengine/ad-products.css'
};

/**
 * @class JWPlayerAssets
 */
class AdEngineAssets {
	constructor() {
		this.wasStyleLoadInitialized = false;
		this.scriptsPromise = null;
	}

	loadStyles() {
		if (!this.wasStyleLoadInitialized) {
			const styles = document.createElement('link');

			styles.rel = 'stylesheet';
			styles.href = assetUrls.adProductsStyles;
			document.head.appendChild(styles);

			this.wasStyleLoadInitialized = true;
		}
	}

	loadScript(url) {
		return new Promise((resolve) => {
			window.M.loadScript(url, true, (data) => {
				resolve(data);
			});
		});
	}

	loadScripts() {
		if (!this.scriptsPromise) {
			this.scriptsPromise = Promise.race([
				this.loadScript(assetUrls.adEngineScript)
					.then((adEngineData) => Promise.all([
						Promise.resolve(adEngineData),
						this.loadScript(assetUrls.adProductsScript)
					])),
				this.loadScript(assetUrls.geoScript)
			]);
		}

		return this.scriptsPromise;
	}

	load() {
		this.loadStyles();

		return this.loadScripts();
	}
}

export default new AdEngineAssets();
