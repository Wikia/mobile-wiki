import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	tagName: 'a',
	attributeBindings: ['href'],
	classNames: ['wds-global-navigation__link'],
	classNameBindings: ['linkClassName'],

	href: computed.oneWay('model.href'),
	linkClassName: computed('model.brand', function () {
		return `wds-is-${this.get('model.brand')}`;
	}),
	trackClick: Ember.K,

	click() {
		this.get('trackClick')(this.get('model.tracking_label'));
	}
});
