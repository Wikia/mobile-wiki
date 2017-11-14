'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.assetUrls = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rsvp = require('rsvp');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (M) {
	M.loadScript = function (src, async, onload, crossorigin) {
		var firstScriptInDocument = document.getElementsByTagName('script')[0];
		var scriptTag = document.createElement('script');

		scriptTag.src = src;
		scriptTag.async = async;

		if (typeof onload === 'function') {
			scriptTag.onload = onload;
		}

		if (typeof crossorigin !== 'undefined') {
			scriptTag.crossOrigin = crossorigin;
		}

		firstScriptInDocument.parentNode.insertBefore(scriptTag, firstScriptInDocument);
	};
})(window.M);

var assetUrls = exports.assetUrls = {
	styles: '/mobile-wiki/assets/jwplayer/index.css',
	script: '/mobile-wiki/assets/jwplayer/wikiajwplayer.js'
};

/**
 * @class JWPlayerAssets
 */

var JWPlayerAssets = function () {
	function JWPlayerAssets() {
		_classCallCheck(this, JWPlayerAssets);

		this.wasStyleLoadInitialized = false;
		this.scriptsPromise = null;
	}

	_createClass(JWPlayerAssets, [{
		key: 'loadStyles',
		value: function loadStyles() {
			if (!this.wasStyleLoadInitialized) {
				$('<link rel="stylesheet" href="' + assetUrls.styles + '" crossorigin="anonymous">').appendTo('head');
				this.wasStyleLoadInitialized = true;
			}
		}
	}, {
		key: 'loadScripts',
		value: function loadScripts() {
			if (!this.scriptsPromise) {
				this.scriptsPromise = new _rsvp.Promise(function (resolve) {
					window.M.loadScript(assetUrls.script, true, function (data) {
						resolve(data);
					}, 'anonymous');
				});
			}

			return this.scriptsPromise;
		}
	}, {
		key: 'load',
		value: function load() {
			this.loadStyles();

			return this.loadScripts();
		}
	}]);

	return JWPlayerAssets;
}();

exports.default = new JWPlayerAssets();
