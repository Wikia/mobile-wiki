define('mobile-wiki/mixins/portable-infobox-hero-image', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Mixin.create({
		heroImage: Ember.computed('model.media', function () {
			var media = this.get('model.media.media');

			if (Ember.isArray(media)) {
				for (var i = 0; i < media.length; i++) {
					if (media[i] && media[i].context === 'infobox-hero-image') {
						return media[i];
					}
				}
			}

			return null;
		}),

		heroImageInHeader: Ember.computed('heroImage', 'model.featuredVideo', function () {
			return !this.get('model.featuredVideo') ? this.get('heroImage') : null;
		})
	});
});