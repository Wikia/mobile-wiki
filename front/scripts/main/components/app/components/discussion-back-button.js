App.DiscussionBackButtonComponent = Em.Component.extend({
	tagName: 'a',
	classNames: ['back-button'],
	attributeBindings: ['href'],
	href: null,
	label: '',

	/**
	 * @returns {void}
	 */
	click() {
		this.sendAction('setLocation');
	}
});
