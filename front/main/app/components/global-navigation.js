import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['wds-global-navigation'],
	model: Ember.Object.create(M.prop('globalNavigationData'))
});
