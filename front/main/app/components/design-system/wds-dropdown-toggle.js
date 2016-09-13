import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
	classNames: ['wds-dropdown__toggle'],
	classNameBindings: ['additionalClassNames'],
	attributeBindings: ['title']
});
