import BaseModel from './base';

export default BaseModel.extend({
	comments: 0,

	/**
	 * @param {Object} data
	 * @returns {void}
	 */
	setData({data}) {
		this._super(...arguments);

		if (data && data.details) {
			this.set('comments', data.details.comments);
		}
	}
});
