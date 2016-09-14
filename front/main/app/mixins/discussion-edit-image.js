import Ember from 'ember';
import EscapePress from './escape-press';
import {track} from '../utils/discussion-tracker';

export default Ember.Mixin.create(
	EscapePress,
	{
		allowedFileTypes: {
			'image/jpeg': true,
			'image/png': true,
			'image/gif': true,
		},
		classNameBindings: ['isEditMode', 'isImagePreviewMode', 'isDragActive:drag-activated',
			'errorMessage:is-error-message'],
		errorMessage: null,
		errorsMessages: {
			fileType: 'main.image-save-failed',
			saveFailed: 'main.image-save-failed',
		},
		imageUrl: null,
		isDragActive: false,
		isEditMode: false,
		isLoadingMode: false,
		isImagePreviewMode: false,
		newImageUrl: null,
		resetFileInput: false,
		// components using this mixin should override this default settings to enable tracking
		trackedActions: {
			EditButtonTapped: '',
			EditEscapeKeyHit: '',
			EditFileDropped: '',
			EditFilePasted: '',
			EditImagePreview: '',
			Save: '',
			SaveFailure: ''
		},
		uploadedFile: null,

		didInsertElement() {
			this._super(...arguments);

			this.$().on('paste', this.onPaste.bind(this));
		},

		dragLeave(event) {
			event.preventDefault();
			this.set('isDragActive', false);
		},

		dragOver(event) {
			if (this.get('isEditMode')) {
				event.preventDefault();
				this.set('isDragActive', true);
			}
		},

		drop(event) {
			if (this.get('isEditMode')) {
				track(this.get('trackedActions.EditFileDropped'));
				event.preventDefault();
				this.send('fileUpload', event.dataTransfer.files);
				this.set('isDragActive', false);
			}
		},

		escapePress(event) {
			track(this.get('trackedActions.EditEscapeKeyHit'));
			this.setEditMode(false);
		},

		/**
		 * Checks if clipboard data contains file as first item.
		 * @private
		 * @param clipboardData
		 */
		hasFileAsFirstItemIn(clipboardData) {
			return clipboardData && clipboardData.items
				&& clipboardData.items.length && clipboardData.items[0].kind === 'file';
		},

		onPaste(event) {
			if (this.get('isEditMode')) {
				const clipboardData = Ember.get(event, 'originalEvent.clipboardData');

				if (this.hasFileAsFirstItemIn(clipboardData)) {
					const files = [clipboardData.items[0].getAsFile()];

					track(this.get('trackedActions.EditFilePasted'));
					event.preventDefault();
					this.send('fileUpload', files);
				}
			}
		},

		// components using this mixin should provide upload method
		uploadMethod() {
			throw new Error('This method should be overwritten in order to upload image.');
		},

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
			this.get('triggerDiscussionHighlightOverlayStateChange')(shouldEnable);

			if (!shouldEnable) {
				this.setProperties({
					isLoadingMode: false,
					isImagePreviewMode: false,
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
			emptyClickForFileInput() {
			},

			enableEditMode() {
				if (this.get('canEdit')) {
					this.setEditMode(true);
					this.escapeOnce();
					track(this.get('trackedActions.EditButtonTapped'));
				}
			},

			disableEditMode() {
				this.setEditMode(false);
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
							isImagePreviewMode: true,
							newImageUrl: event.target.result,
							uploadedFile: imageFile,
						});
						track(this.get('trackedActions.EditImagePreview'));
					}).catch((err) => {
						this.set('isLoadingMode', false);
						this.setErrorMessage(this.get('errorsMessages.saveFailed'));
					});
				} else {
					this.setErrorMessage(this.get('errorsMessages.fileType'));
				}
			},

			submit() {
				const uploadedFile = this.get('uploadedFile');

				if (this.get('isImagePreviewMode') && uploadedFile) {
					this.set('isLoadingMode', true);
					this.get('uploadMethod')(uploadedFile).then(() => {
						this.set('imageUrl', this.get('newImageUrl'));
						track(this.get('trackedActions.Save'));
						this.setEditMode(false);
					}).catch((err) => {
						this.set('isLoadingMode', false);
						track(this.get('trackedActions.SaveFailure'));
						this.setErrorMessage(this.get('errorsMessages.saveFailed'));
					});
				} else {
					this.setEditMode(false);
				}
			}
		}
	});

