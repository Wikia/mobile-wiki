/// <reference path="../app.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />

/**
 * @desc Helper to generate img element with link to thumbnail as the src attribute
 * Use case: {{thumbnail url width=100 height=100 mode=thumbMode alt=name}}
 * Only the first parameter (url) is required, rest is optional
 */
Em.Handlebars.registerBoundHelper('thumbnail', function (url: string, options: any) {
	var thumbnailer = Mercury.Modules.Thumbnailer,
		className: string = '',
		defaultMode: string = thumbnailer.mode.fixedAspectRatio,
		defaultWidth: number = 100,
		defaultHeight: number = 100,
		mode: string,
		width: number,
		height: number,
		alt: string;

	// validate thumbnailer mode
	if (options.hash.mode) {
		for (var key in thumbnailer.mode) {
			if (thumbnailer.mode.hasOwnProperty(key) && thumbnailer.mode[key] === options.hash.mode) {
				mode = options.hash.mode;
				break;
			}
		}
	}

	if (typeof mode === 'undefined') {
		mode = defaultMode;
	}

	width = Em.getWithDefault(options, 'hash.width', defaultWidth);
	height = Em.getWithDefault(options, 'hash.height', defaultHeight);
	alt = Em.Handlebars.Utils.escapeExpression(Em.get(options, 'hash.alt'));
	className = Em.Handlebars.Utils.escapeExpression(Em.get(options, 'hash.className')) || className;

	return new Em.Handlebars.SafeString(
		'<img src="' + thumbnailer.getThumbURL(url, {
			mode: mode,
			width: width,
			height: height
		}) + '" alt="' + alt + '" class="' + className + '">'
	);
});
