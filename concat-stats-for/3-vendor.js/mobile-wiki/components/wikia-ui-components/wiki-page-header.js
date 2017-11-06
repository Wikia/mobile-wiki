define('mobile-wiki/components/wikia-ui-components/wiki-page-header', ['exports', 'mobile-wiki/mixins/viewport', 'mobile-wiki/utils/thumbnail', 'mobile-wiki/utils/track', 'mobile-wiki/modules/hero-image'], function (exports, _viewport, _thumbnail, _track, _heroImage) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var reads = Ember.computed.reads;
	var Component = Ember.Component;
	var htmlSafe = Ember.String.htmlSafe;
	var computed = Ember.computed;
	var isEmpty = Ember.isEmpty;
	exports.default = Component.extend(_viewport.default, {
		fastboot: service(),
		wikiVariables: service(),
		classNames: ['wiki-page-header'],
		classNameBindings: ['heroImage:has-hero-image', 'fastboot.isFastBoot:is-fastboot'],
		attributeBindings: ['style'],
		isMainPage: false,
		siteName: reads('wikiVariables.siteName'),
		mainPageTitle: reads('wikiVariables.mainPageTitle'),

		style: computed('heroImage', 'viewportDimensions.width', function () {
			var heroImage = this.get('heroImage'),
			    windowWidth = this.get('viewportDimensions.width');

			if (isEmpty(heroImage)) {
				return '';
			}

			if (this.get('fastboot.isFastBoot')) {
				// We display brackets placeholder as the background using .is-fastboot class
				return htmlSafe('height: ' + _thumbnail.thumbSize.medium + 'px');
			}

			var heroImageHelper = new _heroImage.default(heroImage, windowWidth);

			return htmlSafe('background-image: url(' + heroImageHelper.thumbnailUrl + '); height: ' + heroImageHelper.computedHeight + 'px'); // eslint-disable-line max-len
		}),

		actions: {
			trackClick: function trackClick() {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'wikiname',
					label: ''
				});
			}
		}
	});
});