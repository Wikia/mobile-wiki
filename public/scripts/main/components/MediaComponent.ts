/// <reference path="../app.ts" />
/// <reference path="../../baseline/Wikia.d.ts" />
'use strict';

App.MediaComponent = Em.Component.extend({
	tagName: 'figure',
	layoutName: 'components/media',
	classNames: ['article-media'],
	attributeBindings: ['style'],

	width: null,
	height: null,
	ref: null,

	computedHeight: function () {
		var imageWidth = this.get('width'),
			pageWidth = $('.article-content').width();

		if (pageWidth < imageWidth) {
			return Math.round(this.get('oldWidth') * (~~this.get('height') / imageWidth));
		}

		return this.get('height');
	}.property('width', 'height'),

	style: function () {
		return "height:%@px;".fmt(this.get('computedHeight'));
	}.property('computedHeight'),

	url: function(){
		return Wikia.article.article.media[this.get('ref')].url;
	}.property('ref')
});
