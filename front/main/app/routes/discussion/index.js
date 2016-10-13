import Ember from 'ember';

import localStorageConnector from '../../utils/local-storage-connector';

export default Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	beforeModel() {
		let params = localStorageConnector.getItem('discussionForumPreviousQueryParams'),
			transitionParams = params ? JSON.parse(params) : null;

		// check if object because of situation when user had previously stored "null" (string) value
		// for transitionParams
		if (!transitionParams || Ember.typeOf(transitionParams) !== 'object') {
			transitionParams = {sort: 'trending'};
		}
		if (Ember.isEmpty(transitionParams.catId)) {
			transitionParams.catId = null;
		}
		this.transitionTo('discussion.forum', {queryParams: transitionParams});
	},
});
