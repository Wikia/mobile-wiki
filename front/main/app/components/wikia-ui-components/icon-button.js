import Ember from 'ember';

export default Ember.Component.extend({
	attributeBindings: ['title'],
	classNames: ['icon-button'],
	iconSize: 16,
	tagName: 'a'
});