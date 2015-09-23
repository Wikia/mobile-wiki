/// <reference path="../app.ts" />
'use strict';

App.DiscussionBackButtonComponent = Em.Component.extend({
	tagName: 'a',
	classNames: ['back-button', 'external'],
	attributeBindings: ['href'],
	href: '/'
});
