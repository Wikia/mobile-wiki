import App from '../app';
import ImageReviewRoute from '../routes/image-review-route';

export default App.ImageReviewItemComponent = Ember.Component.extend({
    editorLayout: 'image-review-item',

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
