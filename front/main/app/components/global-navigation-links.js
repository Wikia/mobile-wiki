import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	classNames: ['wds-dropdown'],
	classNameBindings: ['menuType'],

	showAvatar: computed.equal('model.header.type', 'avatar'),
	menuType: computed('type', function () {
		return `wds-global-navigation__${this.get('type')}`;
	})
});
