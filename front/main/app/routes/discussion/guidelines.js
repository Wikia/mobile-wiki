import Ember from 'ember';
import DiscussionBaseRoute from './base';

export default DiscussionBaseRoute.extend({
	model(params) {
		const indexModel = this.modelFor('discussion');

		return Ember.RSVP.hash({
			attributes: indexModel.attributes,
		});
	},

	/**
	 * @returns {void}
	 */
	activate() {
		Ember.$('body').addClass('standalone');
		this._super();
	},

	/**
	 * @returns {void}
	 */
	deactivate() {
		Ember.$('body').removeClass('standalone');
		this._super();
	},
});
