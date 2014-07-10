/**
 * @define articlelink
 *
 * Library to parse links in an article and return information about how to process a given link.
 */
'use strict';

module W {
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
	export function getLinkInfo(basepath: string, title: string, hash: string, uri: string): {article: string; url: string; } {
		var localPathMatch = uri.match('^' + window.location.origin + '(.*)$');
		if (localPathMatch) {
			var local = localPathMatch[1];
			var namespaces = [
				'Special:',
				'Talk:',
				'User:',
				'User_Talk:',
				'Project:',
				'Project_Talk:',
				'File:',
				'File_Talk:',
				'MediaWiki:',
				'MediaWiki_Talk:',
				'Template:',
				'Template_Talk:',
				'Help:',
				'Help_Talk:',
				'Category:',
				'Category_Talk:',
				'Blog:',
				'Blog_Talk:'
			];
			// Special internal link, we want to treat it as an external. (|| uri.match(/^\/Special:.*/))
			// NOTE: see below, but we might also have to deal with links in the form /Special:.*
			namespaces.forEach(function (ns) {
				var regex = '^\/wiki\/' + ns + '.*$';
				if (local.match(regex)) {
				return {
					article: null,
					url: basepath + local
				};
			}
			});
			/**
			 * Here we test if its an article link. We also have to check for /a/something for the jump links,
			 * because the url will be in that form and there will be a hash
			 * TODO: apparently some wikis might have the article name in the root, like '/article', in which case
			 * I'd use uri.match(/^\/([^\/]*)/) as well to get the article name. Not sure though.
			 */
			var article = local.match(/^\/wiki\/([^\/#]*)(#.*)?/) || local.match(/^\/a\/([^\/#]*)(#.*)?/);
			if (article) {
				if (article[1] === title && hash && hash !== '') {
					return {
						article: null,
						url: hash
					};
				}
				return {
					article: article[1],
					url: null
				};
			}
		}
		return {
			article: null,
			url: uri
		};
	}
}
