/// <reference path="../../baseline/Wikia.d.ts" />
'use strict';

/**
 * @description This module is an alias for whatever script loader implementation
 * we are using. Use this stub to normalize/expose the features available to Wikia
 * developers and also to allow for swapping implementations in the future.
 */
module Wikia.Utils.String {
	/**
	 * We need to support links like:
	 * /wiki/Rachel Berry
	 * /wiki/Rachel  Berry
	 * /wiki/Rachel__Berry
	 *
	 * but we want them to be displayed normalized in URL bar
	 */
	export function sanitize (title: string = '') {
		return decodeURIComponent(title)
			.replace(/\s/g, '_')
			.replace(/_+/g, '_');
	}

	export function normalize (title: string = '') {
		return decodeURIComponent(title)
			.replace(/_/g, ' ')
			.replace(/\s+/g, ' ');
	}
}
