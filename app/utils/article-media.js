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
	const mediaModel = this.media,
		mediaArray = get(mediaModel, 'media');

	if (attrs.ref >= 0 && mediaArray && mediaArray[attrs.ref]) {
		if (name === 'article-media-thumbnail' || name === 'portable-infobox-hero-image') {
			attrs = Object.assign(attrs, mediaArray[attrs.ref], {
				openLightbox: (mediaRef) => {
					this.openLightbox('media', {
						media: mediaModel,
						mediaRef,
						galleryRef: 0
					});
				}
			});
		} else if (name === 'article-media-gallery' || name === 'article-media-linked-gallery') {
			attrs = Object.assign(attrs, {
				items: mediaArray[attrs.ref],
				openLightbox: (mediaRef, galleryRef) => {
					this.openLightbox('media', {
						media: mediaModel,
						mediaRef,
						galleryRef
					});
				}
			});
		}

		if (name === 'portable-infobox-hero-image') {
			attrs = fixPortableInfoboxAttrs(attrs);
		}
	} else if (name === 'portable-infobox-image-collection' && attrs.refs && mediaArray) {
		const getMediaItemsForCollection = (ref) => Object.assign({
				// We will push new item to media so use its length as index of new gallery element
				ref: mediaArray.length
			}, mediaArray[ref]),
			collectionItems = attrs.refs.map(getMediaItemsForCollection);

		// Add new gallery to media object
		// @todo - XW-1362 - it's an ugly hack, we should return proper data from API
		mediaArray.push(collectionItems);

		attrs = Object.assign(attrs, {
			items: collectionItems,
			openLightbox: (mediaRef, galleryRef) => {
				this.openLightbox('media', {
					media: mediaModel,
					mediaRef,
					galleryRef
				});
			}
		});
	}

	return {name, attrs, element};
}
