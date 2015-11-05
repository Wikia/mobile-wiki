/// <reference path="../app.ts" />
'use strict';

App.DiscussionBackButtonComponent = Em.Component.extend({
	tagName: 'a',
	classNames: ['back-button'],
	attributeBindings: ['href'],
	href: null,
	label: '',

	/**
	 * @returns {void}
	 */
	click(): void {
		this.sendAction('setLocation');
	}
});
