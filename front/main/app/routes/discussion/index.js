import Ember from 'ember';

import localStorageConnector from '../../utils/local-storage-connector';

export default Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	beforeModel() {
		let transitionParams = JSON.parse(localStorageConnector.getItem('discussionForumPreviousQueryParams'));

		if (!transitionParams) {
			transitionParams = {sort: this.get('discussionSort.sortBy')};
		}
		this.transitionTo('discussion.forum', {queryParams: transitionParams});
	},
});
