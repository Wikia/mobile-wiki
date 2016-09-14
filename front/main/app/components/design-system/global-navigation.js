import Ember from 'ember';

const {Component, computed} = Ember;

export default Component.extend({
	classNames: ['wds-global-navigation-wrapper'],
	model: Ember.Object.create(M.prop('globalNavigation')),
	searchIsActive: false,

	actions: {
		activateSearch() {
			this.set('searchIsActive', true);
		},

		deactivateSearch() {
			this.set('searchIsActive', false);
		}
	}
});
