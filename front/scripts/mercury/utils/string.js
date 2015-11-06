/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

/**
 * We need to support links like:
 * /wiki/Rachel Berry
 * /wiki/Rachel  Berry
 * /wiki/Rachel__Berry
 *
 * but we want them to be displayed normalized in URL bar
 */
module Mercury.Utils.String {
	/**
	 * @param {string} [title='']
	 * @returns {string}
	 */
	export function normalizeToUnderscore (title: string = ''): string {
		return title
			.replace(/\s/g, '_')
			.replace(/_+/g, '_');
	}

	/**
	 * @param {string} [str='']
	 * @returns {string}
	 */
	export function normalizeToWhitespace (str: string = ''): string {
		return str
			.replace(/_/g, ' ')
			.replace(/\s+/g, ' ');
	}
}
