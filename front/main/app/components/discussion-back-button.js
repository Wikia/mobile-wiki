import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'a',
	classNames: ['back-button', 'active-element-theme-color'],
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
