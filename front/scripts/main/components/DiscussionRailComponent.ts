/// <reference path="../app.ts" />
'use strict';

App.DiscussionRailComponent = Em.Component.extend({
	classNames: ['rail', 'mobile-hidden', 'columns'],
	classNameBindings: [
		'isRight:right',
		'isLeft:left',
		'twoColumn:large-2',
		'threeColumn:large-3'
	],

	isRight: false,
	isLeft: false,

	twoColumn: false,
	threeColumn: false
});
