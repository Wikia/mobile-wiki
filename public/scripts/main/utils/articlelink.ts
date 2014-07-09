/// <reference path="../../../../typings/jquery/jquery.d.ts" />

/**
 * @define articlelink
 * @author Ben Isaacs
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
	 * @param uri the link itself, which can either be absolute, in which case it is treated as an external link,
	 * or relative.
	 *
	 * @return object in the form { article, url }. Only one of article or url will be non-null. If article is
	 * non-null, then the application should transition to that article. If url is non-null, then the application should
	 * go to the link directly. NOTE: url might be a jumplink. Do with that what you will.
	 */
	export function getLinkInfo(basepath: string, title: string, hash: string, uri: string) : {article: string; url: string; } {
	    // Straight external link.
	    if (uri.match(/^https?:\/\/.*/)) {
	        return {
	            article: null,
	            url: uri
	        };
		}
	    // Special internal link, we want to treat it as an external. (|| uri.match(/^\/Special:.*/))
	    // NOTE: see below, but we might also have to deal with links in the form /Special:.*
	    if (uri.match(/^\/wiki\/Special:.*/)) {
	        return {
	            article: null,
	            url: basepath + uri
	        };
		}
	    // Here we test if its an article link.
	    // TODO: apparently some wikis might have the article name in the root, like '/article', in which case
	    // I'd use uri.match(/^\/([^\/]*)/) as well to get the article name. Not sure though.
	    var article = uri.match(/^\/wiki\/([^\/]*)/);
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
	    // Don't recognize form, so we'll just treat it as external
	    // (i.e., named anchors, or some link without leading https?://)
	    return {
	        article: null,
	        url: uri
	    };
	}
}
