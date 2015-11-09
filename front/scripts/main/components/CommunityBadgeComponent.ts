/// <reference path="../app.ts" />
'use strict';

App.CommunityBadgeComponent = Em.Component.extend({
	classNames: ['community-badge'],
	squareDimension: 125,

	badgeImages: {
		24357: '/front/images/community-badge-adventure-time.png',
		8390: '/front/images/community-badge-cocktails.png',
		3035: '/front/images/community-badge-fallout.png',
		119235: '/front/images/community-badge-hawaii-five-o.png',
		35171: '/front/images/community-badge-hunger-games.png',
		203914: '/front/images/community-badge-one-direction.png',
		147: '/front/images/community-badge-star-wars.png',
		5931: '/front/images/community-badge-star-wars.png',
		13346: '/front/images/community-badge-walking-dead.png'
	},

	wikiImageUrl: Em.computed('squareDimension', function (): string {
		var imageUrl = Em.get(Mercury, 'wiki.image');

		// Temporarily override images for launch wikis
		imageUrl = this.get('badgeImages')[Em.get(Mercury, 'wiki.id')];

		if (Em.isEmpty(imageUrl)) {
			return '';
		}

		return Mercury.Modules.Thumbnailer.getThumbURL(
			imageUrl,
			{
				mode: Mercury.Modules.Thumbnailer.mode.topCrop,
				width: this.get('squareDimension'),
				height: this.get('squareDimension'),
			}
		);
	}),

	wikiName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia'),
});
