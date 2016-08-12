import Ember from 'ember';
import DiscussionEditImage from '../mixins/discussion-edit-image';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	DiscussionEditImage,
	{
		classNames: ['community-badge', 'draggable-dropzone'],
		classNameBindings: ['isEditMode', 'isImagePreviewMode', 'isDragActive:drag-activated',
			'errorMessage:is-error-message'],
		fileInputClassNames: ['upload-image-button', 'background-theme-color'],
		squareDimension: 125,

		trackedActions: {
			EditButtonTapped: trackActions.EditCommunityBadgeButtonTapped,
			EditEscapeKeyHit: trackActions.EditCommunityBadgeEscapeKeyHit,
			EditImagePreview: trackActions.EditCommunityBadgeImagePreview,
			Save: trackActions.CommunityBadgeSave,
			SaveFailure: trackActions.CommunityBadgeSaveFailure
		},

		canEdit: Ember.computed.and('editingPossible', 'currentUser.isAuthenticated', 'badgeImage.permissions.canEdit'),
		currentUser: Ember.inject.service(),

		isDragActive: false,

		wikiImageUrl: Ember.computed('badgeImage.value', 'squareDimension', function () {
			let imageUrl = this.get('badgeImage.value');

			if (Ember.isEmpty(imageUrl)) {
				// get wiki image
				imageUrl = Ember.getWithDefault(Mercury, 'wiki.image', '/front/common/symbols/brackets.svg');
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
				track(trackActions.EditCommunityBadgeFileDropped);
				event.preventDefault();
				this.send('fileUpload', event.dataTransfer.files);
				this.set('isDragActive', false);
			}
		}
	}
);
