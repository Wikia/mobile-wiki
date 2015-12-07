import App from '../app';

export default App.ImageReviewItemComponent = Ember.Component.extend({
	actions: {
		setStatus(status) {
			this.set('model.status', status);
		}
	}
});
