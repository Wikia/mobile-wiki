/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

module Mercury.Utils.String {
	export function normalize (str: string = ''): string {
		return str
			.replace(/_/g, ' ')
			.replace(/\s+/g, ' ');
	}

	export function titleToUri (title: string = ''): string {
		return encodeURIComponent(
			title
				.replace(/\s/g, '_')
				.replace(/_+/g, '_')
		);
	}

	export function uriToTitle (uri: string = ''): string {
		var decodedUri: string;

		try {
			decodedUri = decodeURIComponent(uri);
		} catch (error) {
			decodedUri = uri;
		}

		return decodedUri
			.replace(/_/g, ' ')
			.replace(/\s+/g, ' ');
	}
}
