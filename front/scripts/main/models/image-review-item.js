import App from '../app';
import ObjectUtilitiesMixin from '../mixins/object-utilities';

export default App.ImageReviewItemModel = Ember.Object.extend(ObjectUtilitiesMixin, {
	imageId: null,
	thumbnailUrl: null,
	fullSizeImageUrl: null,
	contractId: null,
	status: 'ACCEPTED'
});
