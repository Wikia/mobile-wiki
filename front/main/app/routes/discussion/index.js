import Ember from 'ember';

import localStorageConnector from '../../utils/local-storage-connector';

export default Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	beforeModel() {
		const previousParams =  JSON.parse(localStorageConnector.getItem('discussionForumPreviousQueryParams'));
		this.transitionTo('discussion.forum', previousParams);
	},
});
