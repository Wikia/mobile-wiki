import Ember from 'ember';

const {Component, Object: EmberObj} = Ember;

export default Component.extend({
	classNames: ['wds-global-navigation-wrapper'],
	model: EmberObj.create(M.prop('globalNavigation')),
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
