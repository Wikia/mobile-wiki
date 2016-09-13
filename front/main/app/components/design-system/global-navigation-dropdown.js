import Ember from 'ember';
import DropdownComponentMixin from 'ember-rl-dropdown/mixins/rl-dropdown-component';

const {Component, computed} = Ember;

export default Component.extend(DropdownComponentMixin, {
	classNames: ['wds-dropdown'],
	classNameBindings: ['menuType', 'isActiveClass'],
	dropdownToggleSelector: '.wds-dropdown__toggle',
	dropdownSelector: '.wds-dropdown__content',
	closingEventNamespace: 'wds-dropdown',

	showAvatar: computed.equal('model.header.type', 'avatar'),
	menuType: computed('type', function () {
		return `wds-global-navigation__${this.get('type')}`;
	}),
	isActiveClass: computed('dropdownExpanded', function () {
		if (this.get('dropdownExpanded')) {
			return 'wds-is-active';
		}
		return '';
	})
});
