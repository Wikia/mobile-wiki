/// <reference path="../app.ts" />
'use strict';

App.BackButtonComponent = Em.Component.extend({
	tagName: 'a',
	classNames: ['back-button'],
	click: function (): void {
		this.sendAction('goToMainPage');
	}
});
