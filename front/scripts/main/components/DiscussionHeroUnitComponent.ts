/// <reference path="../app.ts" />
'use strict';

App.DiscussionHeroUnitComponent = Em.Component.extend({
	classNames: ['discussion-hero-unit'],

	bannerImageStyle: Em.computed(function (): Em.Handlebars.SafeString {
		var image: string;

		switch (Em.get(Mercury, 'wiki.id')) {
			case 24357:
				image = 'discussion-header-adventure-time.jpg';
				break;
			case 8390:
				image = 'discussion-header-cocktails.jpg';
				break;
			case 3035:
				image = 'discussion-header-fallout.jpg';
				break;
			case 119235:
				image = 'discussion-header-hawaii-five-o.jpg';
				break;
			case 35171:
				image = 'discussion-header-hunger-games.jpg';
				break;
			case 203914:
				image = 'discussion-header-one-direction.jpg';
				break;
			case 147:
				image = 'discussion-header-star-wars.jpg';
				break;
			case 13346:
				image = 'discussion-header-walking-dead.jpg';
				break;
		}

		return image
			? new Em.Handlebars.SafeString(`background-image: url(/front/images/${image});`)
			: null;
	}),

	bannerColorStyle: Em.computed(function (): Em.Handlebars.SafeString {
		var themeColor = Em.get(Mercury, 'wiki.themeColor');
		return themeColor
			? new Em.Handlebars.SafeString(`background-color: ${themeColor};`)
			: null;
	})
});
