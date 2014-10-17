/**
 * Helper module to generate the URL to a thumbnail of specific size from JS
 *
 * @author Piotr Bablok <piotrbablok@wikia-inc.com>
 * @author Federico "Lox" Lucignano <federico@wikia-inc.com>
 *
 * IMPORTANT: this code needs to be kept in sync with Apache rewrites and the thumbnailer servers' code
 */
'use strict';

interface ImageUrlParameters {
	domain: string;
	cacheBuster: string;
	wikiaBucket: string;
	imagePath: string;
}

module Wikia.Modules {
	export class Thumbnailer {
		private static imagePathRegExp = /\/\/vignette\d?\.wikia/
		private static thumbBasePathRegExp = /(.*\/revision\/\w+).*/;
		private static legacyThumbPathRegExp = /\/images\/thumb\//;
		private static legacyPathRegExp = /(wikia-dev.com|wikia.nocookie.net)\/__cb([\d]+)\/(.+)\/images\/(?:thumb\/)?(.*)$/;

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
			var urlParameters: ImageUrlParameters;

			url = url || '';
			height = height || 0;
			width = width || 50;

			// for now we handle only legacy urls as input
			if (this.isLegacyUrl(url)) {
				if (this.isLegacyThumbnailerUrl(url)) {
					// URL points to a thumbnail, remove crop and size
					url = this.clearThumbOptions(url);
				}

				urlParameters = this.getParametersFromLegacyUrl(url);
				url = this.createThumbnailUrl(urlParameters, type, width, height);
			}

			return url;
		}

		/**
		 * Checks if url points to legacy thumbnailer
		 *
		 * @private
		 *
		 * @param {String} url
		 *
		 * @return {Boolean}
		 */
		static isLegacyThumbnailerUrl(url: string): boolean {
			return url && this.legacyThumbPathRegExp.test(url);
		}

		/**
		 * Checks if url points to thumbnailer
		 *
		 * @public
		 *
		 * @param {String} url
		 *
		 * @return {Boolean}
		 */
		static isThumbnailerUrl(url: string): boolean {
			return url && this.imagePathRegExp.test(url);
		}

		/**
		 * Checks if url points to legacy image URL
		 *
		 * @private
		 *
		 * @param {String} url
		 *
		 * @return {Boolean}
		 */
		static isLegacyUrl(url: string): boolean {
			return url && this.legacyPathRegExp.test(url);
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
			var clearedOptionsUrl: string;

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
		 * Parses legacy image URL and returns object with URL parameters
		 *
		 * @private
		 *
		 * @param {String} url
		 *
		 * @return {ImageUrlParameters}
		 */
		static getParametersFromLegacyUrl(url: string): ImageUrlParameters {
			var urlParsed = this.legacyPathRegExp.exec(url);

			return {
				domain: urlParsed[1],
				cacheBuster: urlParsed[2],
				wikiaBucket: urlParsed[3],
				imagePath: urlParsed[4]
			};
		}

		/**
		 * Constructs complete thumbnailer url
		 *
		 * @private
		 *
		 * @param {ImageUrlParameters} urlParameters
		 * @param {String} type
		 * @param {Number} width
		 * @param {Number} height
		 *
		 * @return {String}
		 */
		static createThumbnailUrl(
			urlParameters: ImageUrlParameters,
			type: string,
			width: number,
			height: number
			): string {
			var url: string,
				mode: string = (type === 'video' || type === 'nocrop') ? 'fixed-aspect-ratio' : 'top-crop';

			url = 'http://vignette.' + urlParameters.domain;
			url += '/' + urlParameters.wikiaBucket;
			url += '/' + urlParameters.imagePath;
			url += '/revision/latest';
			url += '/' + mode;
			url += '/width/' + width;
			url += '/height/' + height;
			url += '?cb=' + urlParameters.cacheBuster;

			if (this.hasWebPSupport) {
				url += '&format=webp';
			}

			return url;
		}
	}
}
