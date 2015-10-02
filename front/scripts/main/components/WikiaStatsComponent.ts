/// <reference path="../app.ts" />
'use strict';

App.WikiaStatsComponent = Em.Component.extend({
	classNames: ['wikia-stats'],
	items: Em.computed('model', function (): any {
		return [
			{'label': 'app.pages-label', 'value': this.get('model.articles')},
			{'label': 'app.photos-label', 'value': this.get('model.images')},
			{'label': 'app.videos-label', 'value': this.get('model.videos')}
		]
	})
});
