import Ember from 'ember';
import DiscussionContributors from './contributors';

const ReportedDetails = DiscussionContributors.extend({
	postId: null,
});

ReportedDetails.reopenClass({
	/**
	 * @typedef {Object} apiReportedDetailsObject - API object with contributors information
	 * @property {number} count - number of all reporters
	 * @property {string} id - id of the reported post
	 * @property {Array} userInfo - list of DiscussionContributor that supposed to be displayed
	 */

	/**
	 * @param {apiReportedDetailsObject} data
	 *
	 * @returns {ReportedDetails.Object}
	 */
	create(data) {
		const newReportedDetails = this._super(data);
		newReportedDetails.set('postId', data.id);

		return newReportedDetails;
	},
});

export default ReportedDetails;
