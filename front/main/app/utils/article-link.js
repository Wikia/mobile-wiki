/**
 * Library to parse links in an article and return information about how to process a given link.
 */

/**
 * @typedef {Object} LinkInfo
 * @property {string|null} article
 * @property {string|null} url
 * @property {string|null} [hash]
 */

/**
 * Only one of article or url will be non-null. If article is
 * non-null, then the application should transition to that article. If url is non-null, then the application should
 * go to the link directly. NOTE: url might be a jumplink. Do with that what you will.
 *
 * @param {string} basePath - the base url of the wiki without trailing slash
 *   i.e. http://lastofus.wikia.com or http://halo.bisaacs.wikia-dev
 * @param {string} title - the title of the article, such as David_Michael_Vigil
 * @param {string} hash - jumplink, either '#something' (to indicate
 *   there is a jumplink) or '' or undefined
 * @param {string} uri - the absolute link
 *
 * @returns {LinkInfo}
 */
export default function getLinkInfo(basePath, title, hash, uri) {
	const localPathMatch = uri.match(`^${window.location.origin}(.*)$`);

	if (localPathMatch) {
		const local = localPathMatch[1],

			/**
			 * Here we test if its an article link. We also have to check for /wiki/something for the jump links,
			 * because the url will be in that form and there will be a hash
			 *
			 * @todo We currently don't handle links to other pages with jump links appended. If input is a
			 * link to another page, we'll simply transition to the top of that page regardless of whether or not
			 * there is a #jumplink appended to it.
			 *
			 * Example match array for http://muppet.wikia.com/wiki/Kermit_the_Frog#Kermit_on_Sesame_Street
			 *     0: "/wiki/Kermit_the_Frog#Kermit on Sesame Street"
			 *     1: "/wiki"
			 *     2: "wiki"
			 *     3: "Kermit_the_Frog"
			 *     4: "#Kermit_on_Sesame_Street"
			 */
			article = local.match(/^(\/(wiki))\/([^#]+)(#.*)?$/);

		let comparison;

		// Handle links to main page
		if (local === '/') {
			return {
				article: '',
				url: basePath + local
			};
		}

		if (article) {
			try {
				comparison = decodeURIComponent(article[3]);
			} catch (e) {
				comparison = article[3];
			}

			if (comparison === title && hash) {
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

/**
 * @param {EventTarget} target
 * @returns {Boolean}
 */
export function isHashLink(target) {
	// We need to use getAttribute because target.href returns whole resolved URL instead of the original value
	return target.hasAttribute('href') && target.getAttribute('href').indexOf('#') === 0;
}
