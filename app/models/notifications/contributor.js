import EmberObject from '@ember/object';
import {inject as service} from '@ember/service';
import {buildUrl} from '../../utils/url';
import getLanguageCodeFromRequest from '../../utils/language';

const DiscussionContributor = EmberObject.extend({
	fastboot: service(),

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
		const langPath = getLanguageCodeFromRequest(this.get('fastboot.request'));

		return buildUrl({
			langPath,
			namespace: 'User',
			relative: true,
			title: name
		});
	},
	/**
	 * @param {*} ownerInjection
	 * @param {object} data
	 *
	 * @returns {Ember.Object}
	 */
	create(ownerInjection, data) {
		let result = null;

		if (data) {
			result = this._super(ownerInjection, {
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
