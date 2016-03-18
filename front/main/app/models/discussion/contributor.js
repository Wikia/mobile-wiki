import Ember from 'ember';

const DiscussionContributor = Ember.Object.extend({
	avatarUrl: null,
	id: null,
	name: null,
	profileUrl: null,

	/**
	 * @param {object} data
	 *
	 * @returns {object}
	 */
	create(data) {
		this._super({
			avatarUrl: data.avatarUrl,
			id: data.id,
			name: data.name,
			profileUrl: this.getProfileUrl(data.name)
		});
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
