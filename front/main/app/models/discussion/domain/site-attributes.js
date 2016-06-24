import Ember from 'ember';
import DiscussionSiteAttribute from './site-attribute';

const DiscussionSiteAttributes = Ember.Object.extend({
	badgeImage: null,
	guidelines: null,
	heroImage: null,
});

DiscussionSiteAttributes.reopenClass({

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
			attributes[attribute.name] = DiscussionSiteAttribute.create({
				permissions: attribute.authorization,
				value: attribute.value,
			});
		});

		return this._super(attributes);
	},
});

export default DiscussionSiteAttributes;
