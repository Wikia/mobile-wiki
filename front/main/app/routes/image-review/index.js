import Ember from 'ember';
import ImageReviewModel from '../../models/image-review/batch-id';

const {Route} = Ember;

export default Route.extend({
	redirect() {
		ImageReviewModel.reserveNewBatch('UNREVIEWED').then(({payload, jqXHR}) => {
			if (jqXHR.status === 204) {
				this.transitionTo('image-review.batch-id', 'unreviewed', 'no-more-images');
			} else {
				this.transitionTo('image-review.batch-id', 'unreviewed', payload.id);
			}
		});
	}
});
