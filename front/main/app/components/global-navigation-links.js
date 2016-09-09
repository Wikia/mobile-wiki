import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['wds-dropdown'],
	classNameBindings: ['menuType'],

	extraDropdownClasses: Ember.computed('dropdownRightAligned', function () {
		return this.get('dropdownRightAligned') ? 'wds-is-right-aligned' : '';
	}),
	showAvatar: Ember.computed.equal('model.header.type', 'avatar'),
	menuType: Ember.computed('type', function () {
		return `wds-global-navigation__${this.get('type')}`;
	})
});
