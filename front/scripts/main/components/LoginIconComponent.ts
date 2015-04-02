'use strict';

App.LoginIconComponent = Em.Component.extend({
	tagName: 'a',
	classNames: ['external', 'login'],

	click: function (): void {
		window.location.href = '/join?redirect=' + encodeURIComponent(window.location.href);
	}
});
