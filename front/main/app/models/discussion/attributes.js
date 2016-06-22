import Ember from 'ember';
import request from 'ember-ajax/request';
import DiscussionAttributes from './domain/attributes';

const DiscussionAttributesModel = Ember.Object.extend({
	data: null,

	/**
	 * @param {object} apiData
	 *
	 * @returns {void}
	 */
	setNormalizedData(apiData) {
		this.set('data', DiscussionAttributes.create(
			Ember.getWithDefault(apiData, '_embedded.attributes', [])
		));
	},
});

DiscussionAttributesModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @returns {Ember.RSVP.Promise}
	 */
	getAttributes(wikiId) {
		return new Ember.RSVP.Promise((resolve) => {
			const attributesInstance = DiscussionAttributesModel.create();

			resolve(attributesInstance);

			request(M.getAttributeServiceUrl(`/site/${wikiId}/attr`)).then((data) => {
				attributesInstance.setNormalizedData(data);

			}).catch(() => {
				// Categories fail silently
			});
		});
	}
});

export default DiscussionAttributesModel;
