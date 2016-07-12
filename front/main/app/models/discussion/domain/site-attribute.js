import Ember from 'ember';
import DiscussionSiteAttributePermissions from './site-attribute-permissions';

const DiscussionSiteAttribute = Ember.Object.extend({
	permissions: null,
	value: null,
});

DiscussionSiteAttribute.reopenClass({
	/**
	 * @param {object} data
	 *
	 * @returns {Ember.Object}
	 */
	create(data) {
		return this._super({
			permissions: DiscussionSiteAttributePermissions.create(data.permissions),
			value: data.value,
		});
	},
});

export default DiscussionSiteAttribute;
