import Ember from 'ember';

export default Ember.Controller.extend(
	{
		application: Ember.inject.controller(),

		smartBannerVisible: Ember.computed.oneWay('application.smartBannerVisible'),
		siteHeadPinned: Ember.computed.oneWay('application.siteHeadPinned'),

		actions: {
			/**
			 * This method will be overwritten in the controller, but needs to be stubbed for the error subcontroller
			 *
			 * @returns {void}
			 */
			deleteAllPosts() {},

			/**
			 * This method will be overwritten in the controller, but needs to be stubbed for the error subcontroller
			 *
			 * @returns {void}
			 */
			applyFilters() {}
		}
	}
);
