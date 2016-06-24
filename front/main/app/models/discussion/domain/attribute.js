import Ember from 'ember';
import DiscussionAttributePermissions from './attribute-permissions';

const DiscussionAttribute = Ember.Object.extend({
	permissions: null,
	value: null,
});

DiscussionAttribute.reopenClass({
	/**
	 * @param {object} data
	 *
	 * @returns {Ember.Object}
	 */
	create(data) {
		return this._super({
			permissions: DiscussionAttributePermissions.create(data.permissions),
			value: data.value,
		});
	},
});

export default DiscussionAttribute;
