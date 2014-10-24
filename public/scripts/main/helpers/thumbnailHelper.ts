/// <reference path="../app.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />

Em.Handlebars.registerBoundHelper('thumbnail', function (value: string, options: any) {
	var thumbnailer = Mercury.Modules.Thumbnailer,
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
	alt = Handlebars.Utils.escapeExpression(Em.getWithDefault(options, 'hash.alt', null));

	return new Em.Handlebars.SafeString(
		'<img src="' + thumbnailer.getThumbURL(value, mode, width, height) + '" alt="' + alt + '">'
	);
});
