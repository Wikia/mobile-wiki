import {Promise} from 'rsvp';

const loadScript = (url) => new Promise((resolve) => $script(url, resolve));

export const assetUrls = {
	adEngineScript: '/mobile-wiki/assets/adengine/ad-engine.global.js',
	adProductsScript: '/mobile-wiki/assets/adengine/ad-products.global.js',
	geoScript: '/mobile-wiki/assets/adengine/geo.global.js'
};

export default {
	scriptsPromise: null,

	load() {
		if (!this.scriptsPromise) {
			this.scriptsPromise = Promise.all([
				loadScript(assetUrls.adEngineScript)
					.then(() => loadScript(assetUrls.adProductsScript)),
				loadScript(assetUrls.geoScript)
			]);
		}

		return this.scriptsPromise;
	}
};
