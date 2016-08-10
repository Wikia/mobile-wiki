import Ember from 'ember';

export default Ember.Mixin.create({
	errorMessage: null,
	isEditMode: false,
	isLoadingMode: false,
	isNewBadgePreviewMode: false,
	newWikiImageUrl: null,
	resetFileInput: false,
	uploadedFile: null,

	setEditMode(shouldEnable) {
		Ember.$('body').toggleClass('mobile-full-screen', shouldEnable);
		this.setProperties({
			isEditMode: shouldEnable,
			resetFileInput: true,
			errorMessage: null,
		});

		if (!shouldEnable) {
			this.setProperties({
				isLoadingMode: false,
				isNewBadgePreviewMode: false,
				newWikiImageUrl: null,
				uploadedFile: null,
			});
		}
	},

	actions: {
		enableEditMode() {
			if (this.get('canEdit')) {
				this.setEditMode(true);
			}
		},

		disableEditMode() {
			this.setEditMode(false);
		},
	}
});

