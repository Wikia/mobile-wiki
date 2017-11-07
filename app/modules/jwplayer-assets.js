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
	loadStyles(cssFile) {
		$(`<link rel="stylesheet" href="${cssFile}" crossorigin="anonymous">`).appendTo('head');
	}

	loadScripts(jsFile) {
		return new RSVP.Promise((resolve) => {
			window.M.loadScript(jsFile, true, (data) => {
				resolve(data);
			}, 'anonymous');
		});
	}
}

const jwPlayerAssets = new JWPlayerAssets();

export default jwPlayerAssets;
