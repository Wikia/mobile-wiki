/// <reference path="../app.ts" />
'use strict';

App.DiscussionRailComponent = Em.Component.extend({
	classNames: ['rail'],
	classNameBindings: ['isRight:right', 'isLeft:left'],

	isRight: false,
	isLeft: false
});
