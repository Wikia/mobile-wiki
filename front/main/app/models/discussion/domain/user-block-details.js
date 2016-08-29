import Ember from 'ember';

const DiscussionUserBlockDetails = Ember.Object.extend({
	blockedBy: null,
	blockExpiry: null,
	blockReasen: null
});

DiscussionUserBlockDetails.reopenClass({
	/**
	 * @param {object} userBlockData
	 *
	 * @returns {Ember.Object}
	 */
	create(userBlockData) {
		return this._super({
			blockedBy: userBlockData.blockedBy,
			blockExpiry: userBlockData.blockReason,
			blockReasen: userBlockData.blockExpiry
		});
	}
});

export default DiscussionUserBlockDetails;
