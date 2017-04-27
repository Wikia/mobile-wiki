import Ember from 'ember';
import {buildUrl} from '../../utils/url';

const {
	Object: EmberObject
} = Ember;

const DiscussionContributor = EmberObject.extend({
	avatarUrl: null,
	badgePermission: null,
	host: null,
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
		return buildUrl({
			namespace: 'User',
			relative: true,
			title: name
		});
	},
	/**
	 * @param {object} data
	 *
	 * @returns {Ember.Object}
	 */
	create(data) {
		let result = null;

		if (data) {
			result = this._super({
				avatarUrl: data.avatarUrl,
				badgePermission: data.badgePermission,
				id: data.id,
				name: data.name,
				profileUrl: DiscussionContributor.getProfileUrl(data.name)
			});
		}
		return result;
	},
});

export default DiscussionContributor;
