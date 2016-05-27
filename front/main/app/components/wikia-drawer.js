import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
	tagName: 'nav',
	classNameBindings: ['shouldBeVisible:slide-into-view:collapsed']
});
