import App from '../app';

export default App.ImageReviewItemComponent = Ember.Component.extend({

	actions: {
		setOk() {
			this.set('model.status', 0);
		},

		setQuestionable() {
			this.set('model.status', 1);
		},

		setDelete() {
			this.set('model.status', 2);
		}
	}
});
