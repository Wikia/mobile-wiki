import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'a',
	attributeBindings: ['href'],
	classNames: ['wds-global-navigation__link'],
	classNameBindings: ['linkClassName'],

	href: Ember.computed.oneWay('model.href'),
	linkClassName: Ember.computed('model.brand', function () {
		return `wds-is-${this.get('model.brand')}`;
	})
});
