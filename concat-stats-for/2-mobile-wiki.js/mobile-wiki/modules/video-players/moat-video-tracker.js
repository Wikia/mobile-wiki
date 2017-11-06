define('mobile-wiki/modules/video-players/moat-video-tracker', ['exports', 'mobile-wiki/modules/video-players/moat-video-tracking-script'], function (exports, _moatVideoTrackingScript) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	var DEFAULT_CONFIG = {
		partnerCode: 'wikiaimajsint377461931603',
		viewMode: 'normal', // google.ima.ViewMode.NORMAL
		slicer1: '',
		slicer2: ''
	};

	function moatVideoTracker(adsManager, adContainer, viewMode, src, pos) {
		var config = Object.assign({}, DEFAULT_CONFIG);

		config.viewMode = viewMode || DEFAULT_CONFIG.viewMode;
		config.slicer1 = src || DEFAULT_CONFIG.slicer1;
		config.slicer2 = pos || DEFAULT_CONFIG.slicer2;

		(0, _moatVideoTrackingScript.default)(adsManager, config, adContainer);
	}

	exports.default = moatVideoTracker;
});