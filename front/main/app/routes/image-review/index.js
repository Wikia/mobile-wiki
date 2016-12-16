import Ember from 'ember';
import ImageReviewModel from '../../models/image-review/batch-id';


const {Route} = Ember;

export default Route.extend({

	redirect() {
		this.controllerFor('image-review').set('status', 'UNREVIEWED');

		ImageReviewModel.reserveNewBatch('UNREVIEWED').then(({payload, jqXHR}) => {
			if (jqXHR.status === 204) {
				this.transitionTo('image-review.batch-id', 'no-more-images');
			} else {
				this.transitionTo('image-review.batch-id', payload.id);
			}
		});
	}
});
