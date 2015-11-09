import Ember from 'ember';

const DiscussionBackButtonComponent = Ember.Component.extend({
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

export default DiscussionBackButtonComponent;
