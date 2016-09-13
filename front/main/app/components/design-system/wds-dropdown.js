import Ember from 'ember';
import DropdownComponentMixin from 'ember-rl-dropdown/mixins/rl-dropdown-component';

const {Component} = Ember;

export default Component.extend(DropdownComponentMixin, {
	classNames: ['wds-dropdown'],
	classNameBindings: ['dropdownExpanded:wds-is-active', 'additionalClassNames'],
	dropdownToggleSelector: '.wds-dropdown__toggle',
	dropdownSelector: '.wds-dropdown__content',
	closingEventNamespace: 'wds-dropdown'
});
