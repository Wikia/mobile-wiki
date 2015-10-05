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

	/**
	 * In order to have consistency in input data we are wrapping them into array if they are not
	 */
	init(): void {
		var media = this.get('media');

		if (!Ember.isArray(media)) {
			this.set('media', [media]);
		}
	},

	find(id: number): ArticleMedia {
		return this.get('media')[id];
	},

	/**
	 * @param title
	 * @returns {{mediaRef: number, galleryRef: number}}
	 */
	getRefsForLightboxByTitle(title: string): LightboxMediaRefs {
		var media = this.get('media'),
			mediaRef: number = null,
			galleryRef: number = null,
			findInMedia = function (mediaItem: ArticleMedia|ArticleMedia[], mediaIndex: number): boolean {
				if (Em.isArray(mediaItem)) {
					return (<ArticleMedia[]>mediaItem).some(findInGallery, {
						mediaIndex: mediaIndex
					});
				} else if (M.String.normalizeToUnderscore((<ArticleMedia>mediaItem).title) ===
					M.String.normalizeToUnderscore(title)) {
					mediaRef = mediaIndex;
					return true;
				}
			},
			findInGallery = function (galleryItem: ArticleMedia, galleryIndex: number): boolean {
				if (M.String.normalizeToUnderscore(galleryItem.title) === M.String.normalizeToUnderscore(title)) {
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
