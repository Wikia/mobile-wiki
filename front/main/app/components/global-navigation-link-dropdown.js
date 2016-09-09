import {Component, computed} from 'ember';

export default Component.extend({
	tagName: 'a',
	attributeBindings: ['href'],
	classNames: ['wds-global-navigation__dropdown-link'],

	href: computed.oneWay('model.href')
});
