import App from '../app';

export default App.ImageReviewItemComponent = Ember.Component.extend({

	// @todo Move this logic from model to route
	actions: {
		setStatus(status) {
			this.set('model.status', status);
		}
	}
});
