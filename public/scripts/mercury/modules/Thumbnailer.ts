/// <reference path="../../baseline/mercury.d.ts" />

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

module Mercury.Modules {
	export class Thumbnailer {
		private static imagePathRegExp: RegExp = /\/\/vignette\d?\.wikia/
		private static thumbBasePathRegExp: RegExp = /(.*\/revision\/\w+).*/;
		private static legacyThumbPathRegExp: RegExp = /\/\w+\/thumb\//;
		private static legacyPathRegExp: RegExp = /(wikia-dev.com|wikia.nocookie.net)\/__cb([\d]+)\/(\w+\/\w+)\/(?:thumb\/)?(.*)$/;

		public static mode: any = {
			fixedAspectRatio: 'fixed-aspect-ratio',
			fixedAspectRatioDown: 'fixed-aspect-ratio-down',
			thumbnail: 'thumbnail',
			thumbnailDown: 'thumbnail-down',
			topCrop: 'top-crop',
			topCropDown: 'top-crop-down',
			zoomCrop: 'zoom-crop',
			zoomCropDown: 'zoom-crop-down'
		};

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
		 * @param {String} mode The thumbnailer mode, one from Thumbnailer.mode
		 * @param {Number} width The width of the thumbnail to fetch
		 * @param {Number} height The height of the thumbnail to fetch
		 *
		 * @return {String}
		 */
		static getThumbURL(
			url: string,
			mode: string,
			width: number,
			height: number
			): string {
			var urlParameters: ImageUrlParameters;

			// for now we handle only legacy urls as input
			if (this.isLegacyUrl(url)) {
				if (this.isLegacyThumbnailerUrl(url)) {
					// URL points to a thumbnail, remove crop and size
					url = this.clearThumbOptions(url);
				}

				urlParameters = this.getParametersFromLegacyUrl(url);
				url = this.createThumbnailUrl(urlParameters, mode, width, height);
			}

			return url;
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
		 * Checks if url points to legacy thumbnailer
		 *
		 * @private
		 *
		 * @param {String} url
		 *
		 * @return {Boolean}
		 */
		private static isLegacyThumbnailerUrl(url: string): boolean {
			return url && this.legacyThumbPathRegExp.test(url);
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
		private static isLegacyUrl(url: string): boolean {
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
		private static clearThumbOptions(url: string): string {
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
		private static getParametersFromLegacyUrl(url: string): ImageUrlParameters {
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
		 * @param {String} mode
		 * @param {Number} width
		 * @param {Number} height
		 *
		 * @return {String}
		 */
		private static createThumbnailUrl(
			urlParameters: ImageUrlParameters,
			mode: string,
			width: number,
			height: number
			): string {
			var url: string[];

			url = [
				'http://vignette.' + urlParameters.domain,
				'/' + urlParameters.wikiaBucket,
				'/' + urlParameters.imagePath,
				'/revision/latest',
				'/' + mode,
				'/width/' + width,
				'/height/' + height,
				'?cb=' + urlParameters.cacheBuster
			];

			if (this.hasWebPSupport) {
				url.push('&format=webp');
			}

			return url.join('');
		}
	}
}
