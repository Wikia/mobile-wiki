/// <reference path="../app.ts" />
'use strict';

interface ArticleMedia {
	[index: string]: any;
	caption: string;
	fileUrl: string;
	height: number;
	link: string;
	title: string;
	type: string;
	url: string;
	user: string;
	width: number;
	context?: string;
}

interface LightboxMediaRefs {
	mediaRef: number;
	galleryRef: number
}

App.MediaModel = Em.Object.extend({
	find: function (id: number): ArticleMedia {
		return this.get('media')[id];
	},

	/**
	 * @param title
	 * @returns {{mediaRef: number, galleryRef: number}}
	 */
	getRefsForLightboxByTitle: function (title: string): LightboxMediaRefs {
		var media = this.get('media'),
			mediaRef: number = null,
			galleryRef: number = null,
			findInMedia = function (mediaItem: ArticleMedia|ArticleMedia[], mediaIndex: number): boolean {
				if (Em.isArray(mediaItem)) {
					return (<ArticleMedia[]>mediaItem).some(findInGallery, {
						mediaIndex: mediaIndex
					});
				} else if ((<ArticleMedia>mediaItem).title === title) {
					mediaRef = mediaIndex;
					return true;
				}
			},
			findInGallery = function (galleryItem: ArticleMedia, galleryIndex: number): boolean {
				if (galleryItem.title === title) {
					mediaRef = this.mediaIndex;
					galleryRef = galleryIndex;
					return true;
				}
				return false;
			};

		if (Em.isArray(media)) {
			media.some(findInMedia);
		} else {
			Em.Logger.debug('Media is not an array', media);
		}

		return {
			mediaRef: mediaRef,
			galleryRef: galleryRef
		};
	},
});
