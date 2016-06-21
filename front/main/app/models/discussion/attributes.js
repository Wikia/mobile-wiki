import Ember from 'ember';

import request from 'ember-ajax/request';

const DiscussionAttributesModel = Ember.Object.extend({
	data: null,

	/**
	 * @param {object} apiData
	 *
	 * @returns {void}
	 */
	setNormalizedData(apiData) {

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

			request(M.getAttributeServiceUrl(`/site/${wikiId}/attr/guidelines`)).then((data) => {
				attributesInstance.setNormalizedData(data);


			}).catch(() => {
				// Categories fail silently
			});
		});
	}
});

export default DiscussionAttributesModel;
