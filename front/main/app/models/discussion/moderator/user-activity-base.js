import Ember from 'ember';
import DiscussionBaseModel from '../base';
import request from 'ember-ajax/request';

const DiscussionUserActivityBaseModel = DiscussionBaseModel.extend(
	{
		fetchDataFromTheService(path, days) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				return request(M.getDiscussionServiceUrl(path), {
					data: {
						days
					}
				}).then((data) => {
					this.setNormalizedData(data);
					resolve(this);
				}).catch((err) => {
					this.setErrorProperty(err);
					reject(this);
				});
			});
		}
	}
);

export default DiscussionUserActivityBaseModel;
