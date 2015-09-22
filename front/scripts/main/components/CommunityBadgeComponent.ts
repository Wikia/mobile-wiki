/// <reference path="../app.ts" />
'use strict';

App.CommunityBadgeComponent = Em.Component.extend({
	classNames: ['community-badge'],
	squareDimension: 125,

	wikiImageUrl: Em.computed('squareDimension', function (): string {
		return Mercury.Modules.Thumbnailer.getThumbURL(
			Em.getWithDefault(Mercury, 'wiki.image', 'Wikia'),
			{
				mode: Mercury.Modules.Thumbnailer.mode.topCrop,
				width: this.get('squareDimension'),
				height: this.get('squareDimension'),
			}
		);
	}),

	wikiName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
});
