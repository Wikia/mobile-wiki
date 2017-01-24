import Ember from 'ember';

export default Ember.Mixin.create(
	{
		getRequestDataWithFormat(requestData) {
			let data = requestData || {};

			data.format = 'html';
			return data;
		}
	}
);
