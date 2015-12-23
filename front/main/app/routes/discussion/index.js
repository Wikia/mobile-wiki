import Ember from 'ember';
import DiscussionIndexModel from '../../models/discussion-index';

export default Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	beforeModel() {
		const controller = this.controllerFor('discussion.forum');

		this.transitionTo('discussion.forum', Mercury.wiki.id, controller.get('sortTypes')[0].name);
	},

	/**
	 * @returns {*}
	 */
	model() {
		return DiscussionIndexModel.find(Mercury.wiki.id);
	}
});
