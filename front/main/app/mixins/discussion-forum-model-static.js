import Ember from 'ember';
import request from 'ember-ajax/request';

export default Ember.Mixin.create(
	{
		// TODO zero variable is just for design review, remove it before release
		findThreads(modelInstance, requestUrl, requestData, zero) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				request(requestUrl, {
					data: requestData,
					traditional: true,
				}).then((data) => {
					modelInstance.setNormalizedData(data, zero);

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
