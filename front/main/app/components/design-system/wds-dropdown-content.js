import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
	classNames: ['wds-dropdown__content'],
	classNameBindings: ['additionalClassNames', 'dropdownRightAligned:wds-is-right-aligned']
});
