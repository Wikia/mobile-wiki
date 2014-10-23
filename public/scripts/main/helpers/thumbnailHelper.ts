/// <reference path="../app.ts" />

Em.Handlebars.registerBoundHelper('thumbnail', function (value: string, options: any) {
	var mode: string,
		width: number,
		height: number,
		alt: string,
		defaultMode: string = Mercury.Modules.Thumbnailer.mode.fixedAspectRatio,
		defaultWidth: number = 100,
		defaultHeight: number = 100;

	// validate thumbnailer mode
	if (options.hash.mode) {
		for (var key in Mercury.Modules.Thumbnailer.mode) {
			if (
				Mercury.Modules.Thumbnailer.mode.hasOwnProperty(key) &&
				Mercury.Modules.Thumbnailer.mode[key] === options.hash.mode
			) {
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
	alt = Em.getWithDefault(options, 'hash.alt', null);

	return new Em.Handlebars.SafeString(
		'<img src="' + Mercury.Modules.Thumbnailer.getThumbURL(value, mode, width, height) + '" alt="' + alt + '">'
	);
});
