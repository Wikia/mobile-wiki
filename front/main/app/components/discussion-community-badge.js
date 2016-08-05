import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';
import {track, trackActions} from '../utils/discussion-tracker';
import EscapePress from '../mixins/escape-press';

export default Ember.Component.extend(
	EscapePress,
	{
		classNames: ['community-badge'],
		classNameBindings: ['isEditMode', 'isNewBadgePreviewMode'],
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
		isNewBadgePreviewMode: false,
		newWikiImageUrl: null,

		resetFileInput: false,
		uploadedFile: null,

		wikiImageUrl: Ember.computed('badgeImage.value', 'squareDimension', function () {
			let imageUrl = this.get('badgeImage.value');

			if (Ember.isEmpty(imageUrl)) {
				// get wiki image
				imageUrl = Ember.getWithDefault(Mercury, 'wiki.image', '/front/common/symbols/brackets.svg');
			}
			else{
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

		click(event) {
			if (event.target.classList.contains('highlight-overlay')) {
				this.setEditMode(false);
			}
		},

		escapePress(event) {
			this.setEditMode(false);
		},

		setEditMode(shouldEnable) {
			Ember.$('body').toggleClass('mobile-full-screen', shouldEnable);
			this.setProperties({
				isEditMode: shouldEnable,
				resetFileInput: true
			})

			if (!shouldEnable) {
				this.setProperties({
					isNewBadgePreviewMode: false,
					uploadedFile: null,
					wikiImageUrl: this.get('newWikiImageUrl')
				});

				this.set('newWikiImageUrl', false);
			}
		},

		actions: {
			/**
			 * Enables/disables community badge edit mode
			 *
			 * @param {boolean} shouldEnable edit mode state
			 *
			 * @returns {void}
			 */
			setEditMode(shouldEnable) {
				this.setEditMode(shouldEnable);
				this.escapeOnce();
				track(trackActions.EditCommunityBadgeButtonTapped);
			},

			submit() {
				this.get('uploadCommunityBadge')(this.get('uploadedFile')).then(() => {
					this.setEditMode(false);
				});
			},

			emptyClickForFileInput(){},

			fileUpload(files) {
				const imageFile = files[0];

				if (!this.get(`allowedFileTypes.${imageFile.type}`)) {
					// error!!!
					return;
				}

				this.set('uploadedFile', imageFile);

				const fileReader = new FileReader();
				fileReader.addEventListener('load', (event) => {
					this.setProperties({
						newWikiImageUrl: event.target.result,
						isNewBadgePreviewMode: true,
					});
				});
				fileReader.readAsDataURL(imageFile);
			},
		},
	}
);
