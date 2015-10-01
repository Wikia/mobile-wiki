/// <reference path="../app.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />

/**
 * @desc Helper to generate img element with link to thumbnail as the src attribute
 * Use case: {{thumbnail url width=100 height=100 mode=thumbMode alt=name}}
 * Only the first parameter (url) is required, rest is optional
 */
App.ThumbnailHelper = Em.Helper.helper(function (params: any[], options: any): Em.Handlebars.SafeString {
	var thumbnailer = Mercury.Modules.Thumbnailer,
		className = '',
		defaultMode: string = thumbnailer.mode.fixedAspectRatio,
		defaultWidth = 100,
		defaultHeight = 100,
		// empty gif
		src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
		mode: string,
		width: number,
		height: number,
		alt: string,
		imgUrl: string = params.join('');

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

	width = Em.getWithDefault(options, 'hash.width', defaultWidth);
	height = Em.getWithDefault(options, 'hash.height', defaultHeight);
	alt = Em.Handlebars.Utils.escapeExpression(Em.get(options, 'alt'));
	className = Em.Handlebars.Utils.escapeExpression(Em.get(options, 'className')) || className;

	if (imgUrl) {
		src = thumbnailer.getThumbURL(imgUrl, {
			mode: mode,
			width: width,
			height: height
		});
	}

	return new Em.Handlebars.SafeString(
		`<img src="${src}" alt="${alt}" class="${className}">`
	);
});
