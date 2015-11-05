/// <reference path="../app.ts" />
'use strict';

App.DiscussionHeroUnitComponent = Em.Component.extend({
	classNames: ['discussion-hero-unit'],
	attributeBindings: ['style'],

	headerImages: {
		24357: 'discussion-header-adventure-time.jpg',
		8390: 'discussion-header-cocktails.jpg',
		3035: 'discussion-header-fallout.jpg',
		119235: 'discussion-header-hawaii-five-o.jpg',
		35171: 'discussion-header-hunger-games.jpg',
		203914: 'discussion-header-one-direction.jpg',
		147: 'discussion-header-star-wars.jpg',
		13346: 'discussion-header-walking-dead.jpg'
	},

	style: Em.computed(function (): Em.Handlebars.SafeString {
		var image = this.get('headerImages')[Em.get(Mercury, 'wiki.id')];
		return image
			? new Em.Handlebars.SafeString(`background-image: url(/front/images/${image});`)
			: null;
	}),
});
