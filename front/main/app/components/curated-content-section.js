import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
	classNames: ['curated-content-section'],
	classNameBindings: ['shouldBeVisible::hidden']
});
