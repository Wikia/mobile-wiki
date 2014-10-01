/// <reference path="../../baseline/Wikia.d.ts" />

/**
 * @define articlelink
 *
 * Library to parse links in an article and return information about how to process a given link.
 */
'use strict';

interface LinkInfo {
	article: string;
	url: string;
	hash?: string;
}

module Wikia.Utils {
	/**
	 * @param basepath the base url of the wiki without trailing slash, i.e. http://lastofus.wikia.com
	 * or http://halo.bisaacs.wikia-dev
	 * @param title the title of the article, such as David_Michael_Vigil
	 * @param hash jumplink, either '#something' (to indicate there is a jumplink) or '' or undefined
	 * @param uri the absolute link
	 *
	 * @return object in the form { article, url }. Only one of article or url will be non-null. If article is
	 * non-null, then the application should transition to that article. If url is non-null, then the application should
	 * go to the link directly. NOTE: url might be a jumplink. Do with that what you will.
	 */
	export function getLinkInfo(basepath: string, title: string, hash: string, uri: string): LinkInfo {
		var localPathMatch = decodeURI(uri).match('^' + window.location.origin + '(.*)$');

		if (localPathMatch) {
			var local = localPathMatch[1];
			// Special internal link, we want to treat it as an external. (|| uri.match(/^\/Special:.*/))
			// NOTE: see below, but we might also have to deal with links in the form /Special:.*
			var namespaces = Wikia.wiki.namespaces;

			for (var ns in namespaces) {
				if (!namespaces.hasOwnProperty(ns) || namespaces[ns].id === 0) {
					continue;
				}
				// Style guide advises using dot accessor instead of brackets, but it is difficult
				// to access a key with an asterisk* in it
				var regex = '^(\/wiki)?\/' + namespaces[ns] + ':.*$';
				if (local.match(regex)) {
					return {
						article: null,
						url: basepath + local
					};
				}
			}
			/**
			 * Here we test if its an article link. We also have to check for /a/something for the jump links,
			 * because the url will be in that form and there will be a hash
			 * Some wikis, e.g. GTA, have article URLs in the from /something without the /wiki, so the /wiki
			 * is optional here.
			 *
			 * TODO: We currently don't handle links to other pages with jump links appended. If input is a
			 * link to another page, we'll simply transition to the top of that page regardless of whether or not
			 * there is a #jumplink appended to it.
			 */
			var article = local.match(/^(\/(a|wiki))?\/([^#]+)(#.*)?$/);
			if (article) {
				if (article[3] === title && hash) {
					return {
						article: null,
						url: hash
					};
				}

				return {
					article: article[3],
					url: null,
					hash: article[4] ? hash : null
				};
			}
		}
		return {
			article: null,
			url: uri
		};
	}
}
