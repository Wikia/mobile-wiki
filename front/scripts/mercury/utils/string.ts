/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

module Mercury.Utils.String {
	/**
	 * We need to support links like:
	 * /wiki/Rachel Berry
	 * /wiki/Rachel  Berry
	 * /wiki/Rachel__Berry
	 *
	 * but we want them to be displayed normalized in URL bar
	 */
	export function sanitize (title: string = ''): string {
		return title
			.replace(/\s/g, '_')
			.replace(/_+/g, '_');
	}

	export function normalize (str: string = ''): string {
		return str
			.replace(/_/g, ' ')
			.replace(/\s+/g, ' ');
	}

	export function titleToUri (title: string = '', encodeQuestionMarks = false): string {
		var uri = encodeURI(sanitize(title));

		if (encodeQuestionMarks) {
			uri = uri.replace('?', '%3F');
		}

		return uri;
	}
}
