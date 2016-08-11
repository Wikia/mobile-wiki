import Ember from 'ember';

export default Ember.Mixin.create({
	allowedFileTypes: {
		'image/jpeg': true,
		'image/png': true,
		'image/gif': true,
	},
	errorMessage: null,
	errorsMessages: {
		fileType: 'main.edit-hero-unit-save-failed',
		saveFailed: 'main.edit-hero-unit-save-failed',
	},
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

	setErrorMessage(msgKey) {
		this.set('errorMessage', i18n.t(msgKey, {ns: 'discussion'}));
	},

	actions: {
		enableEditMode() {
			if (this.get('canEdit')) {
				this.setEditMode(true);
			}
		},

		fileUpload(files) {
			const imageFile = files[0];

			if (this.get(`allowedFileTypes.${imageFile.type}`)) {
				this.setProperties({
					isLoadingMode: true,
					errorMessage: null,
				});
			} else {
				this.setErrorMessage(this.get('errorsMessages.fileType'));
			}
		},

		disableEditMode() {
			this.setEditMode(false);
		}
	}
});

