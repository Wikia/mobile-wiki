import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['shouldBeVisible:slide-into-view:collapsed']
});
