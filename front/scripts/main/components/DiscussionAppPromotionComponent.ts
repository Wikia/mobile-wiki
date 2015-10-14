/// <reference path="../app.ts" />
'use strict';

App.DiscussionAppPromotionComponent = Em.Component.extend({
	classNames: ['discussion-app-promotion'],

	wikiaConfig: Mercury.Utils.prop('wikiaConfig'),

	androidAppLink: Em.computed.oneWay('wikiaConfig.androidAppLink'),

	iosAppLink: Em.computed.oneWay('wikiaConfig.iosAppLink'),
});
