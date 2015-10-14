/// <reference path="../app.ts" />
'use strict';

App.DiscussionAppPromotionComponent = Em.Component.extend({
	classNames: ['discussion-app-promotion'],

	wikiaConfig: Mercury.Utils.prop('wikiaConfig'),

	androidAppLink: Em.computed('wikiaConfig', function () {
		var wikiaConfig = this.get('wikiaConfig');
		return wikiaConfig ? wikiaConfig.androidAppLink : null;
	}),

	iosAppLink: Em.computed(function () {
		var wikiaConfig = this.get('wikiaConfig');
		return wikiaConfig ? wikiaConfig.iosAppLink : null;
	}),
});
