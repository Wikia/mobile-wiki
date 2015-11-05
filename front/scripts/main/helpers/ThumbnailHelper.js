/**
 * Helper to generate img element with link to thumbnail as the src attribute
 * Use case: {{thumbnail url width=100 height=100 mode=thumbMode alt=name}}
 * Only the first parameter (url) is required, rest is optional
 *
 * @param {Array} params
 * @param {Object} options
 * @returns {Em.Handlebars.SafeString}
 */
App.ThumbnailHelper = Em.Helper.helper((params, options) => {
	const thumbnailer = Mercury.Modules.Thumbnailer,
		defaultMode = thumbnailer.mode.fixedAspectRatio,
		defaultWidth = 100,
		defaultHeight = 100,
		imgUrl = params.join('');

	let src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
		className = '',
		mode,
		width,
		height,
		alt;

	// validate thumbnailer mode
	if (options.mode) {
		for (const key in thumbnailer.mode) {
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
			mode,
			width,
			height
		});
	}

	return new Em.Handlebars.SafeString(
		`<img src="${src}" alt="${alt}" class="${className}">`
	);
});
