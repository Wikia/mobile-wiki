/**
 * This list is taken from MediaWiki:app/includes/Defines.php
 * @type {{name: number}}
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
	// communities use Portal as a content namespace but without adding it to wgContentNamespaces
	PORTAL: 116
};

export function isContentNamespace(ns, contentNamespaces = []) {
	// custom namespaces can be in a string format
	return ns === namespace.MAIN || ns == namespace.PORTAL || Boolean(contentNamespaces.some(
			(contentNamespace) => contentNamespace == ns // eslint-disable-line eqeqeq
		));
}
