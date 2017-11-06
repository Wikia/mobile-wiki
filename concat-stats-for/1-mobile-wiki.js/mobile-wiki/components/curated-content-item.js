define('mobile-wiki/components/curated-content-item', ['exports', 'mobile-wiki/mixins/curated-content-thumbnail', 'mobile-wiki/mixins/viewport', 'mobile-wiki/utils/track'], function (exports, _curatedContentThumbnail, _viewport, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var computed = Ember.computed;
	var oneWay = Ember.computed.oneWay;
	var equal = Ember.computed.equal;
	var Component = Ember.Component;
	exports.default = Component.extend(_curatedContentThumbnail.default, _viewport.default, {
		tagName: 'a',
		attributeBindings: ['href'],
		classNames: ['curated-content-item'],
		classNameBindings: ['type'],
		openSection: function openSection() {},

		href: oneWay('model.url'),
		type: oneWay('model.type'),

		isArticle: equal('model.type', 'article'),

		aspectRatio: 1,
		imageWidth: 200,
		thumbUrl: computed('model', function () {
			if (this.get('model.imageUrl')) {
				return this.generateThumbUrl(this.get('model.imageUrl'), this.get('model.imageCrop.' + this.get('aspectRatioName')));
			} else {
				return this.get('emptyGif');
			}
		}),

		icon: computed('type', function () {
			var type = this.get('type'),
			    typesWithDedicatedIcon = ['category', 'video', 'image', 'blog'];

			var iconType = void 0;

			if (typesWithDedicatedIcon.indexOf(type) > -1) {
				iconType = type;
			} else if (type === 'section') {
				// Sections use the same icons as categories
				iconType = 'category';
			} else {
				// Default icon
				iconType = 'article';
			}

			return 'namespace-' + iconType;
		}),

		/**
   * @returns {boolean}
   */
		click: function click() {
			var itemType = this.get('type');

			(0, _track.track)({
				action: _track.trackActions.click,
				category: 'main-page-curated-content',
				label: 'open-item-' + this.get('index')
			});

			if (itemType && itemType === 'section') {
				this.get('openSection')(this.get('model'));
				return false;
			}
		}
	});
});