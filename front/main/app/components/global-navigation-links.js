import {Component, computed} from 'ember';

export default Component.extend({
	classNames: ['wds-dropdown'],
	classNameBindings: ['menuType'],

	extraDropdownClasses: computed('dropdownRightAligned', function () {
		return this.get('dropdownRightAligned') ? 'wds-is-right-aligned' : '';
	}),
	showAvatar: computed.equal('model.header.type', 'avatar'),
	menuType: computed('type', function () {
		return `wds-global-navigation__${this.get('type')}`;
	})
});
