import Ember from 'ember';
import rawRequest from 'ember-ajax/raw'

const {Route} = Ember;

export default Route.extend({

	redirect() {
		this.controllerFor('image-review').set('status', 'UNREVIEWED');

		rawRequest(M.getImageReviewServiceUrl(`/batch`, {
			status: 'UNREVIEWED'
		}), {
			method: 'POST'
		}).then(({payload, jqXHR}) => {
			// In case there are no more images, create empty model and show `No more images to review` message
			if (jqXHR.status === 204) {
				this.transitionTo('image-review.batch-id', 'no-more-images')
			} else {
				this.transitionTo('image-review.batch-id', payload.id);
			}
		});
	}
});
