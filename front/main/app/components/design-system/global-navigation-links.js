import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	tagName: '',

	dropdownContainerClassNames: computed(function () {
		const menuTypeClass = `wds-global-navigation__${this.get('type')}`;

		return `wds-dropdown ${menuTypeClass}`;
	}),
	dropdownClassNames: computed('dropdownRightAligned', function	() {
		const baseClasses = 'wds-dropdown__content wds-global-navigation__dropdown-content';

		if (this.get('dropdownRightAligned')) {
			return `${baseClasses} wds-is-right-aligned`;
		}

		return baseClasses;
	}),
	showAvatar: computed.equal('model.header.type', 'avatar')
});
