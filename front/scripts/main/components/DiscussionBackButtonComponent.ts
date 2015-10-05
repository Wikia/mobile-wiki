/// <reference path="../app.ts" />
'use strict';

App.DiscussionBackButtonComponent = Em.Component.extend({
	tagName: 'a',
	classNames: ['back-button'],
	attributeBindings: ['href'],
	href: null,
	label: '',

	click: function ():void {
		console.log("DiscussionBackButtonComponent sendAction");
		this.sendAction('setLocation');
	}
});
