import Ember from 'ember';
import DiscussionEditImage from '../mixins/discussion-edit-image';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	DiscussionEditImage,
	{
		classNames: ['community-badge', 'draggable-dropzone'],
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

		hasDefaultImage: false,

		wikiImageUrl: Ember.computed('badgeImage.value', function () {
			let imageUrl = this.get('badgeImage.value');

			if (Ember.isEmpty(imageUrl)) {
				// get wiki image
				imageUrl = Ember.getWithDefault(Mercury, 'wiki.image', '/front/common/symbols/fandom-heart.svg');
				this.set('hasDefaultImage', true);
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
		})
	}
);
