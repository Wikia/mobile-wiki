import Ember from 'ember';
import request from 'ember-ajax/request';
import DiscussionSiteAttributes from './domain/site-attributes';

const DiscussionSiteAttributesModel = Ember.Object.extend({
	data: null,
	wikiId: null,

	/**
	 * @param {object} apiData
	 *
	 * @returns {void}
	 */
	setNormalizedData(apiData) {
		this.set('data', DiscussionSiteAttributes.create(
			Ember.getWithDefault(apiData, '_embedded.attributes', [])
		));
	},

	/**
	 * Edit guidelines in site-attribute service
	 * @param {String} name - attribute name
	 * @param {String} value - the new value for the attribute
	 * @returns {Ember.RSVP.Promise}
	 */
	editAttribute(name, value) {
		const attributeData = new FormData();

		attributeData.append('data', value);

		return request(M.getAttributeServiceUrl(`/site/${this.get('wikiId')}/attr/${name}`), {
			data: attributeData,
			method: 'PUT',
			processData: false,
			contentType: false,
			mimeType: 'multipart/form-data',
		}).then((data) => {
			this.set(`data.${data.name}.value`, data.value);

			return this.get(`data.${data.name}`);
		});
	},
});

DiscussionSiteAttributesModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId) {
		return new Ember.RSVP.Promise((resolve) => {
			const attributesInstance = DiscussionSiteAttributesModel.create();

			attributesInstance.set('wikiId', wikiId);

			resolve(attributesInstance);

			request(M.getAttributeServiceUrl(`/site/${wikiId}/attr`)).then((data) => {
				attributesInstance.setNormalizedData(data);

			}).catch(() => {
				// Attributes fail silently
			});
		});
	}
});

export default DiscussionSiteAttributesModel;
