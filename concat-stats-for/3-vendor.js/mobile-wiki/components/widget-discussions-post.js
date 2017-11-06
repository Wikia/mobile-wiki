define('mobile-wiki/components/widget-discussions-post', ['exports', 'mobile-wiki/utils/truncate', 'mobile-wiki/utils/nl2br', 'handlebars'], function (exports, _truncate, _nl2br, _handlebars) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var or = Ember.computed.or;
	var Component = Ember.Component;
	var htmlSafe = Ember.String.htmlSafe;
	var computed = Ember.computed;
	exports.default = Component.extend({
		classNames: ['post-detail'],

		openGraphSiteName: or('post.openGraph.domain', 'post.openGraph.siteName'),

		openGraphImageUrl: computed('post.openGraph.imageUrl', function () {
			var imageWidth = 525,
			    imageHeight = parseInt(imageWidth * 9 / 16, 10);

			if (!this.get('post.openGraph.imageUrl')) {
				return '';
			}

			return this.get('post.openGraph.imageUrl') + '/zoom-crop/width/' + imageWidth + '/height/' + imageHeight;
		}),

		parsedContent: computed('post.rawContent', function () {
			var escapedContent = _handlebars.default.Utils.escapeExpression(this.get('post.rawContent')).trim();

			escapedContent = (0, _truncate.default)(escapedContent, 148);
			escapedContent = (0, _nl2br.default)(escapedContent);

			return htmlSafe(escapedContent);
		})
	});
});