define('mobile-wiki/mixins/image-loader', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Mixin.create({
		/**
   * @param url string
   * @returns Promise
   */
		load: function load(url) {
			return new Promise(function (resolve, reject) {
				var image = new Image();

				image.src = url;

				if (image.complete) {
					resolve(url);
				} else {
					image.addEventListener('load', function () {
						resolve(url);
					});

					image.addEventListener('error', function () {
						reject();
					});
				}
			});
		}
	});
});