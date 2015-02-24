/// <reference path="../app.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />

/**
 * @desc Helper to generate img element with link to thumbnail as the src attribute
 * Use case: {{thumbnail url width=100 height=100 mode=thumbMode alt=name}}
 * Only the first parameter (url) is required, rest is optional
 */
Em.Handlebars.registerBoundHelper('thumbnail', function (url: string, options: any) {
	var thumbnailer = Mercury.Modules.Thumbnailer,
		hash: any = options.hash,
		width: number = hash.width || 100,
		height: number = hash.height || 100,
		mode: string,
		alt: string = Handlebars.Utils.escapeExpression(hash.alt);


	//If hash.mode is set, check if it is a valid one, use fallback if not
	//Get keys of thumbnailer.mode, create array with values of that object and check if we have hash.mode in there
	if (hash.mode && Object.keys(thumbnailer.mode).map(key => thumbnailer.mode[key]).indexOf(hash.mode) > -1) {
		mode = hash.mode;
	} else {
		mode = thumbnailer.mode.fixedAspectRatio;
	}

	return new Em.Handlebars.SafeString(
		'<img src="' + thumbnailer.getThumbURL(url, {mode: mode, width: width, height: height}) + '" alt="' + alt + '">'
	);
});
