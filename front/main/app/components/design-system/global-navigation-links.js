import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	tagName: '',

	dropdownClassNames: computed(function () {
		const menuTypeClass = `wds-global-navigation__${this.get('type')}`;

		return `wds-dropdown ${menuTypeClass}`;
	}),
	showAvatar: computed.equal('model.header.type', 'avatar')
});
