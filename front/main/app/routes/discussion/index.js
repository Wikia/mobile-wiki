import Ember from 'ember';

import localStorageConnector from '../../utils/local-storage-connector';

export default Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	beforeModel() {
		let transitionParams = JSON.parse(localStorageConnector.getItem('discussionForumPreviousQueryParams'));

		if (!transitionParams || Ember.typeOf(transitionParams) !== 'object') {
			transitionParams = {sort: 'trending'};
		}
		this.transitionTo('discussion.forum', {queryParams: transitionParams});
	},
});
