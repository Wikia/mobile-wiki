/// <reference path="../app.ts" />
'use strict';

App.DiscussionAppPromotionComponent = Em.Component.extend({
	classNames: ['discussion-app-promotion'],

	wikiaConfig: M.prop('wikiaConfig'),

	androidAppLink: Em.computed('wikiaConfig', function () {
		var wikiaConfig = this.get('wikiaConfig');
		return wikiaConfig ? wikiaConfig.androidAppLink : null;
	}),

	iosAppLink: Em.computed('wikiaConfig', function () {
		var wikiaConfig = this.get('wikiaConfig');
		return wikiaConfig ? wikiaConfig.iosAppLink : null;
	}),

	shouldDisplay: Em.computed.and('androidAppLink', 'iosAppLink'),
});
