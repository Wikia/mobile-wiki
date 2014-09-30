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
		//targets the image file extension
		private static extRegExp = /\.(jpg|jpeg|gif|bmp|png|svg|webp)$/i;
		private static imagePath = '/images/';
		private static thumbPath = '/images/thumb/';

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
		 * Checks if a URL points to a thumbnail
		 *
		 * @public
		 *
		 * @param {String} url The URL of an image or thumbnail
		 *
		 * @return {Boolean} True f it's a thumbnail or false if it's an image
		 */
		static isThumbUrl(url: string): boolean {
			return url && url.indexOf('/thumb/') > 0;
		}


		/**
		 * Removes the thumbnail options part from a thumbnail URL
		 *
		 * @private
		 *
		 * @param {String} url The URL of a thumbnail
		 *
		 * @return {String} The URL without the thymbnail options
		 */
		static clearThumbOptions(url: string): string {
			//The URL of a thumbnail is in the following format:
			//http://domain/image_path/image.ext/thumbnail_options.ext
			//so return the URL till the last / to remove the options
			return url.substring(0, url.lastIndexOf('/'));
		}

		/**
		 * Switches a thumb path into an image path and vice versa inside an URL
		 *
		 * @private
		 *
		 * @param {String} url The URL of an image or thumbnail
		 * @param {String} type Either 'image' or 'thumb'
		 *
		 * @return {String} The URL with the switched path
		 */
		static switchPathTo(url: string, type: string): string {
			var from: string,
				to: string,
				thumb = (type === 'thumb');

			if (thumb) {
				from = this.imagePath;
				to = this.thumbPath;
			} else {
				from = this.thumbPath;
				to = this.imagePath;
			}

			return url.replace(from, to);
		}

		/**
		 * Converts the URL of a full size image or of a thumbnail into one of a thumbnail of
		 * the specified size and returns it
		 *
		 * @public
		 *
		 * @param {String} url The URL to the full size image or a thumbnail
		 * @param {String} type The type, either 'image' (default, the result will be cropped)
		 * or 'video' (the result will be squeezed)
		 * @param {number} width The width of the thumbnail to fetch
		 * @param {number} height The height of the thumbnail to fetch
		 */
		static getThumbURL(url = '', type = '', width = 50, height = 0) {
			var widthParam = width + (height ? '' : 'px'),
				heightParam = height ? 'x' + height : '-',
				typeParam = (type === 'video' || type === 'nocrop') ? '-' : 'x2-',
				extension = Thumbnailer.hasWebPSupport ? '.webp' : '';

			if (this.isThumbUrl(url)) {
				// URL points to a thumbnail, remove crop and size
				url = this.clearThumbOptions(url);
			} else {
				// URL points to an image, convert to thumbnail URL
				url = this.switchPathTo(url, 'thumb');
			}

			//add parameters to the URL
			var tokens = url.split('/'),
				last = tokens.slice(-1)[0].replace(this.extRegExp, '');

			tokens.push(
				widthParam +
				heightParam +
				typeParam +
				last +
				extension
			);

			return tokens.join('/');
		}

		/**
		 * Converts the URL of a thumbnail into one of a full size image
		 *
		 * @public
		 *
		 * @param {String} url The URL to a thumbnail
		 */
		static getImageURL(url: string): string {
			if (this.isThumbUrl(url)) {
				// URL points to a thumbnail
				url = this.clearThumbOptions(url);
				url = this.switchPathTo(url, 'image');
			}

			return url;
		}
	}
}
