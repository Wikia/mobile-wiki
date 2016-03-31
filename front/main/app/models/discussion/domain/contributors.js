import Ember from 'ember';
import DiscussionContributor from './contributor';

const DiscussionContributors = Ember.Object.extend({
	count: null,
	users: null,
});

DiscussionContributors.reopenClass({
	/**
	 * @returns {void}
	 */
	init() {
		this.set('users', []);
	},
	/**
	 * @typedef {Object} apiContributorsObject - API object with contributors information
	 * @property {number} count - number of all contributors
	 * @property {Array} userInfo - list of DiscussionContributor that supposed to be displayed
	 */

	/**
	 * @param {apiContributorsObject} data
	 *
	 * @returns {Ember.Object}
	 */
	create(data) {
		return this._super({
			count: parseInt(data.count, 10),
			users: data.userInfo.map((contributor) => {
				return DiscussionContributor.create(contributor);
			})
		});
	},
});

export default DiscussionContributors;
