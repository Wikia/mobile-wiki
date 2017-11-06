define('mobile-wiki/helpers/thumbnail', ['exports', 'mobile-wiki/modules/thumbnailer', 'handlebars'], function (exports, _thumbnailer, _handlebars) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var htmlSafe = Ember.String.htmlSafe;
	var getWithDefault = Ember.getWithDefault;
	var get = Ember.get;
	var helper = Ember.Helper.helper;
	exports.default = helper(function (params, options) {
		var thumbnailer = _thumbnailer.default,
		    defaultMode = thumbnailer.mode.fixedAspectRatio,
		    defaultWidth = 100,
		    defaultHeight = 100,
		    imgUrl = params.join('');

		var src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
		    className = '',
		    mode = void 0,
		    width = void 0,
		    height = void 0,
		    alt = void 0;

		// validate thumbnailer mode
		if (options.mode) {
			for (var key in thumbnailer.mode) {
				if (thumbnailer.mode.hasOwnProperty(key) && thumbnailer.mode[key] === options.mode) {
					mode = options.mode;
					break;
				}
			}
		}

		if (typeof mode === 'undefined') {
			mode = defaultMode;
		}

		width = getWithDefault(options, 'width', defaultWidth);
		height = getWithDefault(options, 'height', defaultHeight);
		alt = _handlebars.default.Utils.escapeExpression(get(options, 'alt'));
		className = _handlebars.default.Utils.escapeExpression(get(options, 'className')) || className;

		if (imgUrl) {
			src = thumbnailer.getThumbURL(imgUrl, {
				mode: mode,
				width: width,
				height: height
			});
		}

		return htmlSafe('<img src="' + src + '" alt="' + alt + '" class="' + className + '">');
	});
});