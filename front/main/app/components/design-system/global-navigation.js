import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['wds-global-navigation-wrapper'],
	model: Ember.Object.create(M.prop('globalNavigation'))
});
