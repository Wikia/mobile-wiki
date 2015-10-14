/// <reference path="../app.ts" />
'use strict';

App.DiscussionHeroUnitComponent = Em.Component.extend({
	classNames: ['discussion-hero-unit'],

	bannerImage: Em.computed(function (): string {
		var image: string;

		switch (Mercury.wiki.id) {
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

		if (image) {
			image = '/front/images/' + image;
		}

		return image;
	}),
	bannerColor: Em.get(Mercury, 'wiki.themeColor')
});
