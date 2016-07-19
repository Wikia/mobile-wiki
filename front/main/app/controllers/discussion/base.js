import Ember from 'ember';

export default Ember.Controller.extend(
	{
		application: Ember.inject.controller(),

		smartBannerVisible: Ember.computed.oneWay('application.smartBannerVisible'),
		showCategories: false,

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
			applyFilters() {},

			/**
			 * This method will be overwritten in the controller, but needs to be stubbed for the error subcontroller
			 *
			 * @returns {void}
			 */
			setEditorActive() {},

			/**
			 * This method will be overwritten in the controller, but needs to be stubbed for the error subcontroller
			 *
			 * @returns {void}
			 */
			openGuidelines() {},

			/**
			 * This method will be overwritten in the controller, but needs to be stubbed for the error subcontroller
			 *
			 * @returns {void}
			 */
			updateCategories() {},

			/**
			 * This method will be overwritten in the controller, but needs to be stubbed for the error subcontroller
			 *
			 * @returns {void}
			 */
			openGuidelines() {},
		}
	}
);
