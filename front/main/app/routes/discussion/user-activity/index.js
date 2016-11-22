import Ember from 'ember';

import localStorageConnector from '../../utils/local-storage-connector';

export default Ember.Route.extend({

	discussionSort: Ember.inject.service(),

	/**
	 * @returns {void}
	 */
	beforeModel() {
		this.transitionTo('discussion.user-activity.posts');
	},
});
