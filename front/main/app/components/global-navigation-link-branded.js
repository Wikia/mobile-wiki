import {Component, computed} from 'ember';

export default Component.extend({
	tagName: 'a',
	attributeBindings: ['href'],
	classNames: ['wds-global-navigation__link'],
	classNameBindings: ['linkClassName'],

	href: computed.oneWay('model.href'),
	linkClassName: computed('model.brand', function () {
		return `wds-is-${this.get('model.brand')}`;
	})
});
