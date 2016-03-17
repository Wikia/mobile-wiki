import Ember from 'ember';

const DiscussionContributor = Ember.object.extend({
	avatarUrl: null,
	id: null,
	name: null,

	/**
	 * @param {object} data
	 *
	 * @returns {DiscussionContributor}
	 */
	getNormalizedData(data) {
		this.setProperties({
			avatarUrl: data.avatarUrl,
			id: data.id,
			name: data.name,
			profileUrl: this.getProfileUrl(data.name)
		});

		return this;
	},

	/**
	 * @param {string} username
	 *
	 * @returns {string}
	 */
	getProfileUrl(username) {
		return M.buildUrl({
			namespace: 'User',
			title: username
		});
	}
});

export default DiscussionContributor;
