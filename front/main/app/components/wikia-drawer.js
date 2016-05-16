import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['shouldBeVisible:slide-into-view:collapsed']
});
