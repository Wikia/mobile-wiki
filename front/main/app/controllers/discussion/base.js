import Ember from 'ember';

export default Ember.Controller.extend(
	{
		application: Ember.inject.controller(),

		smartBannerVisible: Ember.computed.oneWay('application.smartBannerVisible'),
		showCategories: true,

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
			updateCategoriesSelection() {},

			/**
			 * This method will be overwritten in the controller, but needs to be stubbed for the error subcontroller
			 *
			 * @returns {void}
			 */
			setEditorActive() {},

			/**
			 * @returns {void}
			 */
			gotoGuidelines() {
				this.get('target').send('gotoGuidelines');
			},

			/**
			 * This method will be overwritten in the controller, but needs to be stubbed for the error subcontroller
			 * @returns {void}
			 */
			openGuidelines() {},

			/**
			 * This method will be overwritten in the controller, but needs to be stubbed for the error subcontroller
			 *
			 * @returns {void}
			 */
			updateCategories() {},
		}
	}
);
