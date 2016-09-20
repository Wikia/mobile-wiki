import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	tagName: 'a',
	attributeBindings: ['href'],
	classNames: ['wds-global-navigation__dropdown-link'],

	href: computed.oneWay('model.href'),

	click: function() {
		this.sendAction('trackClick', this.get('model.title.key'));
	}
});
