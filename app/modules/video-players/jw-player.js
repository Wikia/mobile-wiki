import BasePlayer from './base';

export const ooyalaAssets = {
	styles: [
		'/mobile-wiki/assets/jwplayer/index.css'
	],
	script: '/mobile-wiki/assets/jwplayer/wikiajwplayer.js'
};

export default class JWPlayer extends BasePlayer {
	setupPlayer() {
		if (!window.wikiaJWPlayer) {
			this.loadPlayer();
		} else {
			this.createPlayer();
		}
	}

	/**
	 * @returns {void}
	 */
	createPlayer() {
		window.wikiaJWPlayer('jw-player', {
			// adding this object enables tracking
			tracking: {
				// pass track function, data argument structure in tracking.js in track function
				track: function (data) {
					console.log('track', data);
				},
				// pass custom dimension function, probably just window.guaSetCustomDimension
				setCustomDimension: function () {
					console.log('setCustomDimension', arguments);
				},
				// set to true if you want to enable comscore tracking
				comscore: false
			},
			autoplay: {
				// set to true when you want to give user option to enable/disable autoplay
				// autoplay toggle appears in settings menu which sends event `autoplayToggle` on click
				showToggle: true,
				// set to true if you want video to autostart
				enabled: true,
			},
			related: {
				// countdown time to autoplay next video
				time: 3,
				// playlistId configured in dashboard
				playlistId: 'Y2RWCKuS',
				// enable/disable autoplay for related videos
				autoplay: true
			},
			videoDetails: {
				// description of the video
				description: 'description',
				// title of the video
				title: 'title',
				// pass playlist returned by jwplayer API
				playlist: [{
					"labels": "\/Fandom,\/Fandom\/Movies,\/Fandom\/Specialized,\/Fandom\/wiki,",
					"mediaid": "LnqN4iBt",
					"description": "From Accio to Wingardium Leviosa, magical spells are a vital part of the Wizarding World of Harry Potter. Join us as we take a look at the five best spells from the Harry Potter Universe.",
					"pubdate": 1486075388,
					"tags": "Wiki,Movies,Fandom,Harry Potter,Specialized",
					"image": "https:\/\/cdn.jwplayer.com\/thumbs\/LnqN4iBt-720.jpg",
					"title": "5 Best Spells in the Harry Potter Universe",
					"sources": [{
						"type": "application\/vnd.apple.mpegurl",
						"file": "https:\/\/cdn.jwplayer.com\/manifests\/LnqN4iBt.m3u8"
					}, {
						"width": 320,
						"height": 180,
						"type": "video\/mp4",
						"file": "https:\/\/cdn.jwplayer.com\/videos\/LnqN4iBt-TI0yeHZW.mp4",
						"label": "180p"
					}, {
						"width": 480,
						"height": 270,
						"type": "video\/mp4",
						"file": "https:\/\/cdn.jwplayer.com\/videos\/LnqN4iBt-DnzUC89Y.mp4",
						"label": "270p"
					}, {
						"width": 720,
						"height": 406,
						"type": "video\/mp4",
						"file": "https:\/\/cdn.jwplayer.com\/videos\/LnqN4iBt-xhZUqUI6.mp4",
						"label": "406p"
					}, {
						"width": 1280,
						"height": 720,
						"type": "video\/mp4",
						"file": "https:\/\/cdn.jwplayer.com\/videos\/LnqN4iBt-1lt3rSsE.mp4",
						"label": "720p"
					}, {
						"type": "audio\/mp4",
						"file": "https:\/\/cdn.jwplayer.com\/videos\/LnqN4iBt-LiJWxqIn.m4a",
						"label": "AAC Audio"
					}, {
						"width": 1920,
						"height": 1080,
						"type": "video\/mp4",
						"file": "https:\/\/cdn.jwplayer.com\/videos\/LnqN4iBt-cSpmBcaY.mp4",
						"label": "1080p"
					}],
					"tracks": [{
						"kind": "thumbnails",
						"file": "https:\/\/cdn.jwplayer.com\/strips\/LnqN4iBt-120.vtt"
					}],
					"link": "https:\/\/cdn.jwplayer.com\/previews\/LnqN4iBt",
					"duration": 159,
					"originalName": "020217_Harry Potter_FINAL_no watermark.mp4"
				}]
			}
		});
	}

	/**
	 * @return {void}
	 */
	loadPlayer() {
		this.loadStyles(ooyalaAssets.styles);
		this.loadScripts(ooyalaAssets.script, this.playerDidLoad.bind(this));
	}

	loadStyles(cssFiles) {
		const html = cssFiles.map((url) => {
			return `<link rel="stylesheet" href="${url}" crossorigin="anonymous">`;
		}).join('');

		$(html).appendTo('head');
	}

	loadScripts(jsFile, callback) {
		$script(jsFile, () => {
			callback();
		});
	}

	/**
	 * @returns {void}
	 */
	playerDidLoad() {
		this.createPlayer();
	}
}

