import Ember from 'ember';
import DiscussionEditImage from '../mixins/discussion-edit-image';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	DiscussionEditImage,
	{
		classNames: ['community-badge', 'draggable-dropzone'],
		defaultImageUrl: '/front/common/symbols/fandom-heart.svg',
		fileInputClassNames: ['upload-image-button', 'background-theme-color'],

		trackedActions: {
			EditButtonTapped: trackActions.EditCommunityBadgeButtonTapped,
			EditEscapeKeyHit: trackActions.EditCommunityBadgeEscapeKeyHit,
			EditFileDropped: trackActions.EditCommunityBadgeFileDropped,
			EditFilePasted: trackActions.EditCommunityBadgeFilePasted,
			EditImagePreview: trackActions.EditCommunityBadgeImagePreview,
			Save: trackActions.CommunityBadgeSave,
			SaveFailure: trackActions.CommunityBadgeSaveFailure
		},

		canEdit: Ember.computed.and('editingPossible', 'currentUser.isAuthenticated', 'badgeImage.permissions.canEdit'),
		currentUser: Ember.inject.service(),

		hasDefaultImage: Ember.computed('wikiImageUrl', function () {
			return Ember.isEqual(this.get('wikiImageUrl'), this.get('defaultImageUrl'));
		}),

		showDefaultBackground: Ember.computed('hasDefaultImage', 'isImagePreviewMode', function () {
			return this.get('hasDefaultImage') && !this.get('isImagePreviewMode');
		}),

		wikiImageUrl: Ember.computed('badgeImage.value', function () {
			return this.get('badgeImage.value') || this.get('defaultImageUrl');
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

		actions: {
			clickWikiName() {
				track(trackActions.WikiNameClicked);
			}
		}
	}
);
