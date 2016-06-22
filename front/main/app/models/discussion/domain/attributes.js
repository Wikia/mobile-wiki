import Ember from 'ember';
import DiscussionAttribute from './attribute';

const DiscussionAttributes = Ember.Object.extend({
	badgeImage: null,
	guidelines: null,
	heroImage: null,
});

DiscussionAttributes.reopenClass({

	/**
	 * @param {Object[]} attributesData
	 * @param {Object} attributesData.authorization
	 * @param {Boolean} attributesData.authorization.canEdit
	 * @param {String} attributesData.name
	 * @param {String} attributesData.value
	 *
	 * @returns {Ember.Object}
	 */
	create(attributesData) {
		const attributes = [];

		attributesData.forEach((attribute) => {
			attributes[attribute.name] = DiscussionAttribute.create({
				permissions: attribute.authorization,
				value: attribute.value,
			});
		});

		return this._super(attributes);
	},
});

export default DiscussionAttributes;
