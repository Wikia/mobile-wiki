define('mobile-wiki/components/fastboot-only/article-video-scripts', ['exports', 'mobile-wiki/modules/video-players/ooyala-v4'], function (exports, _ooyalaV) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	exports.default = Component.extend({
		tagName: '',
		layoutName: 'components/fastboot-only/article-video-scripts',
		script: _ooyalaV.ooyalaAssets.script
	});
});