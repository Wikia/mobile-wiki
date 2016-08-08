import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';
import {track, trackActions} from '../utils/discussion-tracker';
import EscapePress from '../mixins/escape-press';

export default Ember.Component.extend(
	EscapePress,
	{
		classNames: ['community-badge', 'draggable-dropzone'],
		classNameBindings: ['isEditMode', 'isNewBadgePreviewMode', 'isDragActive:drag-activated'],
		fileInputClassNames: ['upload-image-button', 'background-theme-color'],
		squareDimension: 125,

		allowedFileTypes: {
			'image/jpeg': true,
			'image/png': true,
			'image/gif': true,
		},

		currentUser: Ember.inject.service(),
		canEdit: Ember.computed.and('editingPossible', 'currentUser.isAuthenticated', 'badgeImage.permissions.canEdit'),
		isEditMode: false,
		isLoadingMode: false,
		isNewBadgePreviewMode: false,
		newWikiImageUrl: null,

		resetFileInput: false,
		uploadedFile: null,

		isDragActive : false,

		wikiImageUrl: Ember.computed('badgeImage.value', 'squareDimension', function () {
			let imageUrl = this.get('badgeImage.value');

			if (Ember.isEmpty(imageUrl)) {
				// get wiki image
				imageUrl = Ember.getWithDefault(Mercury, 'wiki.image', '/front/common/symbols/brackets.svg');
			} else {
				// imageUrl = Thumbnailer.getThumbURL(
				// 	imageUrl,
				// 	{
				// 		mode: Thumbnailer.mode.topCrop,
				// 		width: this.get('squareDimension'),
				// 		height: this.get('squareDimension')
				// 	}
				// );
			}

			return imageUrl;
		}),

		wikiName: Ember.get(Mercury, 'wiki.siteName'),

		/**
		 * TREK INITIATIVE EXPERIMENT
		 *
		 * @returns {string}
		 */
		displayedWikiName: Ember.computed(function () {
			if (Ember.get(Mercury, 'wiki.id') === 734209) {
				return 'Star Trek';
			} else {
				return this.get('wikiName');
			}
		}),

		escapePress(event) {
			this.setEditMode(false);
		},

		setEditMode(shouldEnable) {
			Ember.$('body').toggleClass('mobile-full-screen', shouldEnable);
			this.setProperties({
				isEditMode: shouldEnable,
				resetFileInput: true,
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

		uploadImage(imageFile) {
			return new Promise((resolve, reject) => {
				const fileReader = new FileReader();

				fileReader.addEventListener('load', resolve);
				fileReader.readAsDataURL(imageFile);
			});
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
				event.preventDefault();
				this.send('fileUpload', event.dataTransfer.files);
				this.set('isDragActive', false);
			}
		},

		actions: {
			/**
			 * empty method for the file-input helper
			 * @return {void}
			 */
			emptyClickForFileInput() {},

			/**
			 * Enables community badge edit mode
			 *
			 * @returns {void}
			 */
			enableEditMode() {
				this.setEditMode(true);
				this.escapeOnce();
				track(trackActions.EditCommunityBadgeButtonTapped);
			},

			/**
			 * Disables community badge edit mode
			 *
			 * @returns {void}
			 */
			disableEditMode() {
				this.setEditMode(false);
			},

			submit() {
				if (!this.get('canEdit')) {
					return;
				}

				if (!this.get('isNewBadgePreviewMode') || !this.get('uploadedFile')) {
					this.setEditMode(false);
					return;
				}

				this.set('isLoadingMode', true);
				this.get('uploadCommunityBadge')(this.get('uploadedFile')).then(() => {
					this.set('wikiImageUrl', this.get('newWikiImageUrl'));
					this.setEditMode(false);
				});
			},

			fileUpload(files) {
				if (!this.get('canEdit')) {
					return;
				}

				const imageFile = files[0];

				if (!this.get(`allowedFileTypes.${imageFile.type}`)) {
					// error!!!
					return;
				}

				this.set('isLoadingMode', true);

				this.uploadImage(imageFile).then((event) => {
					this.setProperties({
						isLoadingMode: false,
						isNewBadgePreviewMode: true,
						newWikiImageUrl: event.target.result,
						uploadedFile: imageFile,
					});
				});
			},
		},
	}
);
