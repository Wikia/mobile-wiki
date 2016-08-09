import Ember from 'ember';
import request from 'ember-ajax/request';
import DiscussionBaseModel from './base';
import DiscussionSiteAttributes from './domain/site-attributes';

const DiscussionSiteAttributesModel = DiscussionBaseModel.extend({
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
	 * Save attribute in site-attribute service
	 * @param {String} name - attribute name
	 * @param {String|Object} attributeData - the new value for the attribute
	 * @returns {Ember.RSVP.Promise}
	 */
	saveAttribute(name, attributeData) {
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

	/**
	 * @param {String} name - attribute name
	 * @param {Object} image - the new image for the attribute
	 * @returns {Ember.RSVP.Promise}
	 */
	saveImageAttribute(name, image) {
		const attributeData = new FormData();

		attributeData.append('data', image);

		return this.saveAttribute(name, attributeData);
	},

	/**
	 * @param {String} name - attribute name
	 * @param {String} text - the new text for the attribute
	 * @returns {Ember.RSVP.Promise}
	 */
	saveTextAttribute(name, text) {
		const attributeData = new FormData();

		attributeData.append('data', JSON.stringify(text));

		return this.saveAttribute(name, attributeData);
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

			request(M.getAttributeServiceUrl(`/site/${wikiId}/attr`)).then((data) => {
				attributesInstance.setNormalizedData(data);
			}).catch((err) => {
				attributesInstance.setErrorProperty(err);
			});

			resolve(attributesInstance);
		});
	}
});

export default DiscussionSiteAttributesModel;
