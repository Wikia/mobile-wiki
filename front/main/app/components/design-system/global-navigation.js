import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['wds-global-navigation'],
	model: Ember.Object.create(M.prop('globalNavigation'))
});
