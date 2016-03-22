import Ember from 'ember';

const DiscussionContributor = Ember.Object.extend({
	avatarUrl: null,
	id: null,
	name: null,
	profileUrl: null,
});

DiscussionContributor.reopenClass({
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
	},
	/**
	 * @param {object} data
	 *
	 * @returns {object}
	 */
	create(data) {
		return this._super({
			avatarUrl: data.avatarUrl,
			id: data.id,
			name: data.name,
			profileUrl: DiscussionContributor.getProfileUrl(data.name)
		});
	},
});

export default DiscussionContributor;
