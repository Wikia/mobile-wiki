import Ember from 'ember';
import request from 'ember-ajax/request';
import ContentFormatMix from './discussion-content-format-static';

export default Ember.Mixin.create(
	ContentFormatMix,
	{
		findThreads(modelInstance, requestUrl, requestData) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				request(requestUrl, {
					data: this.getRequestDataWithFormat(requestData),
					traditional: true,
				}).then((data) => {
					modelInstance.setNormalizedData(data);

					modelInstance.setStartPageNumber(requestData ? requestData.page + 1 : 1);

					resolve(modelInstance);

					modelInstance.reportedDetailsSetUp(modelInstance.get('data.entities'));
				}).catch((err) => {
					modelInstance.setErrorProperty(err);

					reject(modelInstance);
				});
			});
		},
	}
);
