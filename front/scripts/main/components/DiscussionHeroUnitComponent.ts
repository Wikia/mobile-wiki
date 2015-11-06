/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />

'use strict';

App.DiscussionHeroUnitComponent = Em.Component.extend(App.ViewportMixin, {
	classNames: ['discussion-hero-unit'],
	attributeBindings: ['style'],

	style: null,

	headerImages: {
		24357: 'discussion-header-adventure-time.jpg',
		8390: 'discussion-header-cocktails.jpg',
		3035: 'discussion-header-fallout.jpg',
		119235: 'discussion-header-hawaii-five-o.jpg',
		35171: 'discussion-header-hunger-games.jpg',
		203914: 'discussion-header-one-direction.jpg',
		147: 'discussion-header-star-wars.jpg',
		5931: 'discussion-header-star-wars.jpg',
		13346: 'discussion-header-walking-dead.jpg'
	},

	didInsertElement(): void {
		this.viewportChangeObserver();
	},

	viewportChangeObserver: Em.observer('viewportDimensions.width', function (): Em.Handlebars.SafeString {
		var visibleElement = this.$(':visible'),
			isShown = !!(visibleElement && visibleElement.length),
			image = this.get('headerImages')[Em.get(Mercury, 'wiki.id')];
		if (!this.get('style') && isShown && image) {
			this.set('style', new Em.Handlebars.SafeString(`background-image: url(/front/images/${image});`));
		}
	}),
});
