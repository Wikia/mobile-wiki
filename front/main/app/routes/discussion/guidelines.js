import Ember from 'ember';
import DiscussionBaseRoute from './base';

export default DiscussionBaseRoute.extend({
	model() {
		const indexModel = this.modelFor('discussion');

		return Ember.RSVP.hash({
			attributes: indexModel.attributes,
		});
	},

	/**
	 * @returns {void}
	 */
	activate() {
		Ember.$('body').addClass('standalone-page');
		this._super();
	},

	/**
	 * @returns {void}
	 */
	deactivate() {
		Ember.$('body').removeClass('standalone-page');
		this._super();
	},

	actions: {
		editGuidelines(text) {

		},
	}
});
