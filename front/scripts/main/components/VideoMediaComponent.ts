/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
'use strict';

App.VideoMediaComponent = App.ImageMediaComponent.extend({
	classNames: ['article-video'],
	layoutName: 'components/video-media',

	isInfoboxVideo: Em.computed('media', function (): boolean {
		var media = this.get('media');
		return media.context === 'infobox-video';
	})
});
