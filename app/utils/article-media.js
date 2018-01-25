import $ from 'jquery';
import {get} from '@ember/object';

/**
 * @param {{context: string, type: string}} attrs
 * @returns {Object}
 */
function fixPortableInfoboxAttrs(attrs) {
	/**
	 * Ember has its own context attribute, that is why we have to use different attribute name
	 */
	if (attrs.context) {
		/**
		 * We don't want to show titles below videos in infoboxes.
		 * This check is just a hack.
		 * Perfectly this should be handled somewhere inside infobox-related logic.
		 * For now this solution is enough
		 * - it works the same way as on wikis without SEO friendly images.
		 * It works on wikis without SEO friendly images because there was a bug
		 * - video was treated as an image and we don't show titles below images.
		 */
		if (attrs.context === 'infobox' && attrs.type === 'video') {
			attrs.showTitle = false;
		}

		attrs.mediaContext = attrs.context;
		delete attrs.context;
	}

	return attrs;
}

/**
 * @param {string} name
 * @param {Object} attrs
 * @param {Object} element
 * @returns {{name: string, attrs: Object, element: Object}}
 */
export default function getAttributesForMedia({name, attrs, element}) {
	attrs = $.extend(attrs, {
		openLightbox: this.openLightbox
	});

	if (name === 'portable-infobox-hero-image') {
		attrs = fixPortableInfoboxAttrs(attrs);
	} else if (name === 'portable-infobox-image-collection' && attrs.refs && mediaArray) {
		const getMediaItemsForCollection = (ref) => $.extend({}),
			collectionItems = attrs.refs.map(getMediaItemsForCollection);

		attrs = $.extend(attrs, {
			items: collectionItems,
		});
	}

	return {name, attrs, element};
}
