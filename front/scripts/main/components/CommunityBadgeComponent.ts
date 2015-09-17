/// <reference path="../app.ts" />
'use strict';

App.CommunityBadgeComponent = Em.Component.extend({
	classNames: ['community-badge'],
	wikiImageUrl: Mercury.Modules.Thumbnailer.getThumbURL(
		Em.getWithDefault(Mercury, 'wiki.image', 'Wikia'),
		{
			mode: Mercury.Modules.Thumbnailer.mode.topCrop,
			width: 125,
			height: 125,
		}
	),
	wikiName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
});
