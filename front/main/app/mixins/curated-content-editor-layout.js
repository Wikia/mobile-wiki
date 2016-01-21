import Ember from 'ember';

export default Ember.Mixin.create({
	imageProperties: {
		url: '',
		id: ''
	},

	itemFormLayout: {
		name: 'curated-content-editor-item-form'
	},

	imageSearchLayout: {
		name: 'curated-content-editor-image-search',
		next: 'curated-content-editor-image-crop',
		previous: 'curated-content-editor-item-form'
	},

	imageCropLayout: {
		name: 'curated-content-editor-image-crop',
		next: 'curated-content-editor-item-form'
		// previous is dynamic
	}
});
