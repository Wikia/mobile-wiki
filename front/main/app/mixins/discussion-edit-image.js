import Ember from 'ember';
import {track} from '../utils/discussion-tracker';

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
	newImageUrl: null,
	resetFileInput: false,
	// components using this mixin should override this default settings to enable tracking
	trackingActions: {
		EditImagePreview: ''
	},
	uploadedFile: null,

	uploadImage(imageFile) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const fileReader = new FileReader();

			fileReader.addEventListener('load', resolve);
			fileReader.readAsDataURL(imageFile);
		});
	},

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
				newImageUrl: null,
				uploadedFile: null,
			});
		}
	},

	setErrorMessage(msgKey) {
		this.set('errorMessage', i18n.t(msgKey, {ns: 'discussion'}));
	},

	actions: {
		/**
		 * Empty method for the file-input helper required click method.
		 * @return {void}
		 */
		emptyClickForFileInput() {},

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

				this.uploadImage(imageFile).then((event) => {
					this.setProperties({
						isLoadingMode: false,
						isNewBadgePreviewMode: true,
						newImageUrl: event.target.result,
						uploadedFile: imageFile,
					});
					track(this.get('trackingActions.EditImagePreview'));
				}).catch((err) => {
					this.set('isLoadingMode', false);
					this.setErrorMessage(this.get('errorsMessages.saveFailed'));
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

