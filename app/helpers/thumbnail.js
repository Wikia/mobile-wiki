import { htmlSafe } from '@ember/string';
import { getWithDefault, get } from '@ember/object';
import { helper } from '@ember/component/helper';
import Thumbnailer from '../modules/thumbnailer';
import { transparentImageBase64 } from '../utils/thumbnail';
import Ember from 'ember';

/**
 * Helper to generate img element with link to thumbnail as the src attribute
 * Use case: {{thumbnail url width=100 height=100 mode=thumbMode alt=name}}
 * Only the first parameter (url) is required, rest is optional
 *
 * @param {Array} params
 * @param {Object} options
 * @returns {htmlSafe}
 */
export default helper((params, options) => {
	const thumbnailer = Thumbnailer,
		defaultMode = thumbnailer.mode.fixedAspectRatio,
		defaultWidth = 100,
		defaultHeight = 100,
		imgUrl = params.join('');

	let src = transparentImageBase64,
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

	width = getWithDefault(options, 'width', defaultWidth);
	height = getWithDefault(options, 'height', defaultHeight);
	alt = Ember.Handlebars.Utils.escapeExpression(get(options, 'alt'));
	className = Ember.Handlebars.Utils.escapeExpression(get(options, 'className')) || className;

	if (imgUrl) {
		src = thumbnailer.getThumbURL(imgUrl, {
			mode,
			width,
			height
		});
	}

	return htmlSafe(
		`<img src="${src}" alt="${alt}" class="${className}">`
	);
});
