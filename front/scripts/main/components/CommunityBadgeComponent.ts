/// <reference path="../app.ts" />
'use strict';

App.CommunityBadgeComponent = Em.Component.extend({
	classNames: ['community-badge'],
	squareDimension: 125,
	// This property needs to be set depending on whether the wiki has a light or
	// dark theme: #f6f6f6 for light, #000000 for dark. However, that logic is not
	// in place yet, and all launch wikis use a light theme, so for now it's hard-coded.
	borderColor: '#f6f6f6',
	imageStyle: Em.computed('borderColor', function (): Em.Handlebars.SafeString {
		return new Em.Handlebars.SafeString('border: 2px solid ' + this.get('borderColor') + ';');
	}),

	wikiImageUrl: Em.computed('squareDimension', function (): string {
		var imageUrl = Em.get(Mercury, 'wiki.image');

		// Temporarily override images for launch wikis
		switch (Em.get(Mercury, 'wiki.id')) {
			case 24357:
				imageUrl = '/front/images/community-badge-adventure-time.png';
				break;
			case 8390:
				imageUrl = '/front/images/community-badge-cocktails.png';
				break;
			case 3035:
				imageUrl = '/front/images/community-badge-fallout.png';
				break;
			case 119235:
				imageUrl = '/front/images/community-badge-hawaii-five-o.png';
				break;
			case 35171:
				imageUrl = '/front/images/community-badge-hunger-games.png';
				break;
			case 203914:
				imageUrl = '/front/images/community-badge-one-direction.png';
				break;
			case 147:
				imageUrl = '/front/images/community-badge-star-wars.png';
				break;
			case 13346:
				imageUrl = '/front/images/community-badge-walking-dead.png';
				break;
		}

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

	wikiName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
});
