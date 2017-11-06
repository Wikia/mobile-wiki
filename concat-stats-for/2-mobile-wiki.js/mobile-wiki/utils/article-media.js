define('mobile-wiki/utils/article-media', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = getAttributesForMedia;
	var $ = Ember.$;
	var get = Ember.get;


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
	function getAttributesForMedia(_ref) {
		var _this = this;

		var name = _ref.name,
		    attrs = _ref.attrs,
		    element = _ref.element;

		var mediaModel = this.media,
		    mediaArray = get(mediaModel, 'media');

		if (attrs.ref >= 0 && mediaArray && mediaArray[attrs.ref]) {
			if (name === 'article-media-thumbnail' || name === 'portable-infobox-hero-image') {
				attrs = $.extend(attrs, mediaArray[attrs.ref], {
					openLightbox: function openLightbox(mediaRef) {
						_this.openLightbox('media', {
							media: mediaModel,
							mediaRef: mediaRef,
							galleryRef: 0
						});
					}
				});
			} else if (name === 'article-media-gallery' || name === 'article-media-linked-gallery') {
				attrs = $.extend(attrs, {
					items: mediaArray[attrs.ref],
					openLightbox: function openLightbox(mediaRef, galleryRef) {
						_this.openLightbox('media', {
							media: mediaModel,
							mediaRef: mediaRef,
							galleryRef: galleryRef
						});
					}
				});
			}

			if (name === 'portable-infobox-hero-image') {
				attrs = fixPortableInfoboxAttrs(attrs);
			}
		} else if (name === 'article-media-map-thumbnail') {
			attrs = $.extend(attrs, {
				openLightbox: this.openLightbox
			});
		} else if (name === 'portable-infobox-image-collection' && attrs.refs && mediaArray) {
			var getMediaItemsForCollection = function getMediaItemsForCollection(ref) {
				return $.extend({
					// We will push new item to media so use its length as index of new gallery element
					ref: mediaArray.length
				}, mediaArray[ref]);
			},
			    collectionItems = attrs.refs.map(getMediaItemsForCollection);

			// Add new gallery to media object
			// @todo - XW-1362 - it's an ugly hack, we should return proper data from API
			mediaArray.push(collectionItems);

			attrs = $.extend(attrs, {
				items: collectionItems,
				openLightbox: function openLightbox(mediaRef, galleryRef) {
					_this.openLightbox('media', {
						media: mediaModel,
						mediaRef: mediaRef,
						galleryRef: galleryRef
					});
				}
			});
		}

		return { name: name, attrs: attrs, element: element };
	}
});