import Ember from 'ember';
import DiscussionAttribute from './attribute';

const DiscussionAttributes = Ember.Object.extend({
	badgeImage: null,
	guidelines: null,
	heroImage: null,
});

DiscussionAttributes.reopenClass({

	/**
	 * @param {object} attributesData
	 *
	 * @returns {Ember.Object}
	 */
	create(attributesData) {
		const attributes = [];

		attributesData.forEach((attribute) => {
			const permissions = [];

			// TODO: need to be fixed
			for (let key in attribute.authorization) {
				if (attribute.authorization.hasOwnProperty(key) && attribute.authorization[key] === true) {
					permissions.push(key);
				}
			}

			attributes[attribute.name] = DiscussionAttribute.create({
				permissions,
				value: attribute.value,
			});
		});

		return this._super(attributes);
	},
});

export default DiscussionAttributes;
