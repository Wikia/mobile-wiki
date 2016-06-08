import Ember from 'ember';
import DiscussionContributors from './contributors';

const ReportDetails = DiscussionContributors.extend({
	postId: null,
});

ReportDetails.reopenClass({
	/**
	 * @typedef {Object} apiReportDetailsObject - API object with contributors information
	 * @property {number} count - number of all reporters
	 * @property {string} postId - id of the reported post
	 * @property {Array} userInfo - list of DiscussionContributor that supposed to be displayed
	 */

	/**
	 * @param {apiReportDetailsObject} data
	 *
	 * @returns {ReportedDetails.Object}
	 */
	create(data) {
		const newReportDetails = this._super(data);
		newReportDetails.set('postId', data.postId);

		return newReportDetails;
	},
});

export default ReportDetails;
