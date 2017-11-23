/* eslint no-console: 0 */
import Ads from '../ads';
import DomHelper from '../dom-helper';
import JWPlayerVideoAds from '../video-players/jwplayer-video-ads';

const wikiVariables = M.getFromShoebox('applicationData.wikiVariables');
const adsUrl = `${wikiVariables.cdnRootUrl}/__am/${wikiVariables.cacheBuster}/groups/-/mercury_ads_js`;
const adsModule = Ads.getInstance();

adsModule.init(adsUrl);

const adsContext = M.getFromShoebox('wikiPage.data.adsContext'),
	featuredVideoData = M.getFromShoebox('wikiPage.data.article.featuredVideo.embed');

adsModule.reloadAfterTransition(adsContext);

function initializePlayer(bidParams) {
	window.wikiaJWPlayer(
		'pre-featured-video',
		{
			tracking: {
				track(data) {
					// M.tracker.UniversalAnalytics.track(
					// 	data.category, data.action, data.label, data.value
					// );
					// M.tracker.Internal.track('special/videoplayerevent', data);
				},
				setCustomDimension: function () {}//M.tracker.UniversalAnalytics.setDimension,
				// comscore: config.environment === 'production'
			},
			settings: {
				showAutoplayToggle: true,
				showCaptions: true
			},
			// selectedCaptionsLanguage: this.params.selectedCaptionsLanguage,
			autoplay: true,
			mute: true,
			related: {
				time: 3,
				playlistId: featuredVideoData.jsParams.recommendedVideoPlaylist || 'Y2RWCKuS',
				autoplay: true
			},
			videoDetails: {
				description: 'test',
				title: featuredVideoData.jsParams.playlist[0].title,
				playlist: featuredVideoData.jsParams.playlist
			},
			logger: {
				clientName: 'mobile-wiki'
			},
			lang: wikiVariables.language.content
		},
		onCreate.bind(this, bidParams)
	);
}

function onCreate(bidParams, player) {
	var adsInstance = adsModule;
	if (adsInstance.jwPlayerAds && adsInstance.jwPlayerMoat) {
		adsInstance.jwPlayerAds(player, bidParams);
		adsInstance.jwPlayerMoat(player);
	}

	player.on('adImpression', function (event) {
		(function (M) {
			if (typeof FastBoot === 'undefined' && M.getFromShoebox('serverError')) {
				// No need to load Ember in browser on server error page
				return;
			}
			M.loadScript('/mobile-wiki/assets/vendor.js', false, false, 'anonymous');
			M.loadScript('/mobile-wiki/assets/mobile-wiki.js', false, false, 'anonymous');
		})(window.M);
	});
}

function createPlayer() {
	adsModule.waitForReady()
	.then(() => {
		(new JWPlayerVideoAds({ noAds: false })).getConfig()
	})
	.then(initializePlayer.bind(this));

}

function updateFeaturedVideoPosition() {
	const videoOffset = DomHelper.offset(document.querySelector('.article-featured-video'));
	document.querySelector('#pre-featured-video-wrapper').style.top = `${videoOffset.top}px`;
}



createPlayer();
updateFeaturedVideoPosition();
window.updateFeaturedVideoPosition = updateFeaturedVideoPosition;
