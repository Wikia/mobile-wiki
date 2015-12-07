import App from '../app';

export default App.ImageReviewItemComponent = Ember.Component.extend({
	actions: {
		showModal(id) {
			this.sendAction('showModal', id);
		}
	}
});
