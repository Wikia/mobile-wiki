import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	classNames: ['wds-global-navigation'],
	classNameBindings: ['searchIsActive:wds-search-is-active'],
	model: Ember.Object.create(M.prop('globalNavigation')),
	searchIsActive: false,

	actions: {
		searchActivate() {
			this.set('searchIsActive', true);
		},

		searchDeactivate() {
			this.set('searchIsActive', false);
		}
	}
});
