import Ember from 'ember';
import ImageReviewModel from '../../models/image-review/batch-id';

const {Route} = Ember;

export default Route.extend({

	model(params) {
		return ImageReviewModel.reserveNewBatch(params.status, params.order, params.source);
	},

	redirect(model) {
		this.transitionTo('image-review.batch-id', model);
	}
});
