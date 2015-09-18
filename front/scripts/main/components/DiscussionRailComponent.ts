/// <reference path="../app.ts" />
'use strict';

App.DiscussionRailComponent = Em.Component.extend({
	classNames: ['rail'],
	classNameBindings: [
		'isRight:right',
		'isLeft:left',
		'twoColumn:two-column',
		'threeColumn:three-column'
	],

	isRight: false,
	isLeft: false,

	twoColumn: false,
	threeColumn: false
});
