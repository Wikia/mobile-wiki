'use strict';

App.LoginIconComponent = Em.Component.extend({
	tagName: 'a',
	classNames: ['external', 'login'],
	attributeBindings: ['href'],
	href: '/join?redirect=' + encodeURIComponent(window.location.href)
});
