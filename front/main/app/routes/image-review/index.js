import Ember from 'ember';
import ImageReviewModel from '../../models/image-review/batch-id';

const {Route} = Ember;

export default Route.extend({

	model(params) {
		return ImageReviewModel.reserveNewBatch(params.status, params.order).then(({payload, jqXHR}) => {
			if (jqXHR.status === 204) {
				return 'no-more-images';
			} else {
				return payload.id;
			}
		});
	},

	redirect(model) {
		this.transitionTo('image-review.batch-id', model);
	}
});
