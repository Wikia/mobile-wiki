define('mobile-wiki/mixins/portable-infobox-hero-image', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var isArray = Ember.isArray;
	var computed = Ember.computed;
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create({
		heroImage: computed('model.media', function () {
			var media = this.get('model.media.media');

			if (isArray(media)) {
				for (var i = 0; i < media.length; i++) {
					if (media[i] && media[i].context === 'infobox-hero-image') {
						return media[i];
					}
				}
			}

			return null;
		}),

		heroImageInHeader: computed('heroImage', 'model.featuredVideo', function () {
			return !this.get('model.featuredVideo') ? this.get('heroImage') : null;
		})
	});
});