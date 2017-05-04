/**
 * This list is taken from MediaWiki:app/includes/Defines.php
 */
export const namespace = {
	// virtual namespaces
	MEDIA: -2,
	SPECIAL: -1,
	// real namespaces
	MAIN: 0,
	TALK: 1,
	USER: 2,
	USER_TALK: 3,
	PROJECT: 4,
	PROJECT_TALK: 5,
	FILE: 6,
	FILE_TALK: 7,
	MEDIAWIKI: 8,
	MEDIAWIKI_TALK: 9,
	TEMPLATE: 10,
	TEMPLATE_TALK: 11,
	HELP: 12,
	HELP_TALK: 13,
	CATEGORY: 14,
	CATEGORY_TALK: 15,
	IMAGE: 6,
	IMAGE_TALK: 7,
	BLOG_ARTICLE: 500
};

/**
 * @param {number} ns
 *
 * @param {string[]} contentNamespaces
 * @returns {boolean}
 */
export function isContentNamespace(ns, contentNamespaces = []) {
	return ns === namespace.MAIN || Boolean(contentNamespaces.some(
			// custom namespaces can be in a string format
			(contentNamespace) => parseInt(contentNamespace, 10) === ns
		));
}
