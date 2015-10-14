/// <reference path="../app.ts" />
/// <reference path='../../../../typings/hapi/hapi.d.ts' />
'use strict';

App.DiscussionAppPromotionComponent = Em.Component.extend({
	classNames: ['discussion-app-promotion'],

	wikiaConfig: Mercury.Utils.prop('wikiaConfig'),

	androidAppLink: Em.computed('wikiaConfig', function () {
		return this.get('wikiaConfig') ? this.get('wikiaConfig').androidAppLink : null;
	}),

	iosAppLink: Em.computed(function () {
		return this.get('wikiaConfig') ? this.get('wikiaConfig').iosAppLink : null;
	}),
});
