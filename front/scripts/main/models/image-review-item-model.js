import App from '../app';
import ObjectUtilitiesMixin from '../mixins/object-utilities';

export default App.ImageReviewItemModel = Ember.Object.extend(App.ObjectUtilitiesMixin, {
	imageId: '123',
	contractId: null,
	status: 0
});
