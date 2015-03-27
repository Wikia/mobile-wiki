/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

module Mercury.Utils.String {
	export function normalize (str: string = ''): string {
		return str
			.replace(/_/g, ' ')
			.replace(/\s+/g, ' ');
	}

	export function titleToUri (title: string = '', encodeQuestionMarks = false): string {
		var uri = encodeURI(
			title
				.replace(/\s/g, '_')
				.replace(/_+/g, '_')
		);

		if (encodeQuestionMarks) {
			uri = uri.replace('?', '%3F');
		}

		return uri;
	}
}
