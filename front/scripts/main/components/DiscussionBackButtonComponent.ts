/// <reference path="../app.ts" />
'use strict';

App.DiscussionBackButtonComponent = Em.Component.extend({
	tagName: 'a',
	classNames: ['back-button', 'active-element-theme'],
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
