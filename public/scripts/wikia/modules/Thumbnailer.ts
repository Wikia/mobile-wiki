/**
 * Helper module to generate the URL to a thumbnail of specific size from JS
 *
 * @author Piotr Bablok <piotrbablok@wikia-inc.com>
 * @author Federico "Lox" Lucignano <federico@wikia-inc.com>
 *
 * IMPORTANT: this code needs to be kept in sync with Apache rewrites and the thumbnailer servers' code
 */
'use strict';

module Wikia.Modules {
	export class Thumbnailer {
		private static imagePathRegExp = /\/\/vignette\d?\.wikia/
		private static thumbBasePathRegExp = /(.*\/revision\/\w+).*/;
		private static legacyThumbPathRegExp = /\/images\/thumb\//;
		private static legacyPathRegExp = /(wikia-dev.com|wikia.nocookie.net)\/__cb([\d]+)\/(.+)\/images\/(.*)$/;

		static hasWebPSupport = (function () {
			// @see http://stackoverflow.com/a/5573422
			var webP = new Image();
			webP.src = 'data:image/webp;' +
			'base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
			webP.onload = webP.onerror = () => {
				Thumbnailer.hasWebPSupport = (webP.height === 2);
			};

			return false;
		})();

		/**
		 * Converts the URL of a full size image or of a thumbnail into one of a thumbnail of
		 * the specified size and returns it
		 *
		 * @public
		 *
		 * @param {String} url The URL to the full size image or a thumbnail
		 * @param {String} type The type, either 'image' (default, the result will be cropped)
		 * or 'video' (the result will be squeezed)
		 * @param {Number} width The width of the thumbnail to fetch
		 * @param {Number} height The height of the thumbnail to fetch
		 *
		 * @return {String}
		 */
		static getThumbURL(url: string, type: string, width: number, height: number): string {
			url = url || '';
			height = height || 0;
			width = width || 50;

			if (this.isThumbUrl(url)) {
				// URL points to a thumbnail, remove crop and size
				url = this.clearThumbOptions(url);
			}

			// for now we assume this url is always a legacy one
			url = this.createThumbnailUrlFromLegacyUrl(url, type, width, height);

			return url;
		}

		/**
		 * Checks if a URL points to a thumbnail
		 *
		 * @public
		 *
		 * @param {String} url The URL of an image or thumbnail
		 *
		 * @return {Boolean} True f it's a thumbnail or false if it's an image
		 */
		static isThumbUrl(url: string): boolean {
			return this.isLegacyThumbnailerUrl(url) || this.isThumbnailerUrl(url);
		}

		/**
		 * Checks if url points to legacy thumbnailer
		 *
		 * @private
		 *
		 * @param {String} url
		 *
		 * @returns {Boolean}
		 */
		static isLegacyThumbnailerUrl(url: string): boolean {
			return url && this.legacyThumbPathRegExp.test(url);
		}

		/**
		 * Checks if url points to thumbnailer
		 *
		 * @private
		 *
		 * @param {String} url
		 *
		 * @returns {Boolean}
		 */
		static isThumbnailerUrl(url: string): boolean {
			return url && this.imagePathRegExp.test(url);
		}

		/**
		 * Removes the thumbnail options part from a thumbnail URL
		 *
		 * @private
		 *
		 * @param {String} url The URL of a thumbnail
		 *
		 * @return {String} The URL without the thumbnail options
		 */
		static clearThumbOptions(url: string): string {
			var clearedOptionsUrl;

			if (this.isThumbnailerUrl(url)) {
				clearedOptionsUrl = url.replace(this.thumbBasePathRegExp, '$1');
			} else {
				//The URL of a legacy thumbnail is in the following format:
				//http://domain/image_path/image.ext/thumbnail_options.ext
				//so return the URL till the last / to remove the options
				clearedOptionsUrl = url.substring(0, url.lastIndexOf('/'));
			}
			return clearedOptionsUrl;
		}

		/**
		 * Creates thumbnail URL from legacy image URL which has to be stripped from thumbnail parameters already.
		 *
		 * @private
		 *
		 * @param {String} url
		 * @param {String} type
		 * @param {Number} width
		 * @param {Number} height
		 *
		 * @return {string} The URL
		 */
		static createThumbnailUrlFromLegacyUrl(url: string, type: string, width: number, height: number): string {
			var urlParsed = this.legacyPathRegExp.exec(url);
			url = 'http://vignette.' + urlParsed[1] + '/' + urlParsed[3] + '/' + urlParsed[4] + '/revision/latest';
			url = this.addParametersToUrl(url, type, width, height);
			url += '?cb=' + urlParsed[2];

			if (this.hasWebPSupport) {
				url += '&format=webp';
			}

			return url;
		}

		/**
		 * Constructs complete thumbnailer url by appending parameters to url
		 *
		 * @private
		 *
		 * @param {String} url
		 * @param {String} type
		 * @param {Number} width
		 * @param {Number} height
		 *
		 * @returns {String} The URL with parameters for the thumbnailer added
		 */
		static addParametersToUrl(url, type, width, height) {
			url = this.addThumbnailerParameters(url, type, width, height);
			return url;
		}

		/**
		 * Constructs complete thumbnailer url by appending parameters to url
		 * URL before: http://vignette2.wikia.nocookie.net/thelastofus/f/ff/Joel.png/revision/latest
		 * URL after: http://vignette2.wikia.nocookie.net/thelastofus/f/ff/Joel.png/revision/latest/zoom-crop/width/240/height/240
		 *
		 * @private
		 *
		 * @param {String} url
		 * @param {String} type
		 * @param {Number} width
		 * @param {Number} height
		 *
		 * @returns {String}
		 */
		static addThumbnailerParameters(url, type, width, height) {
			var thumbnailerRoute = (type === 'video' || type === 'nocrop') ? '/fixed-aspect-ratio' : '/top-crop';
			return url + thumbnailerRoute + '/width/' + width + '/height/' + height;
		}
	}
}
