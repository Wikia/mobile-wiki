import Ember from 'ember';

const DiscussionContributor = Ember.Object.extend({
	avatarUrl: null,
	id: null,
	name: null,
	profileUrl: null,
});

DiscussionContributor.reopenClass({
	/**
	 * @param {string} name
	 *
	 * @returns {string}
	 */
	getProfileUrl(name) {
		return M.buildUrl({
			namespace: 'User',
			title: name
		});
	},
	/**
	 * @param {object} data
	 *
	 * @returns {Ember.Object}
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
