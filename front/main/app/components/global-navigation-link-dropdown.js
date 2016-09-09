import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'a',
	attributeBindings: ['href'],
	classNames: ['wds-global-navigation__dropdown-link'],

	href: Ember.computed.oneWay('model.href')
});
