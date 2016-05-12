import Ember from 'ember';
import LanguagesMixin from '../mixins/languages';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	LanguagesMixin,
	{
		classNames: ['contribution-container'],
		layoutName: 'components/article-contribution',
		section: null,
		sectionId: null,
		title: null,
		uploadFeatureEnabled: null,

		actions: {
			/**
			 * Activate section editor
			 * If login is required to edit, redirect to login page
			 *
			 * @returns {void}
			 */
			edit() {
				const section = this.get('section');

				if (this.get('editAllowed')) {
					track({
						action: trackActions.click,
						category: 'sectioneditor',
						label: 'edit',
						value: section
					});
					this.sendAction('edit', this.get('title'), section);
				} else {
					this.redirectToLogin('edit-section-no-auth');
				}
			},

			/**
			 * Go to add photo
			 * If login is required to add photo, redirect to login page
			 *
			 * @returns {void}
			 */
			addPhoto() {
				if (this.get('addPhotoAllowed')) {
					const photoData = this.$('.file-upload-input')[0].files[0];

					track({
						action: trackActions.click,
						category: 'sectioneditor',
						label: 'add-photo',
						value: this.get('section')
					});
					this.sendAction('addPhoto', this.get('title'), this.get('section'), photoData);
				} else {
					this.redirectToLogin('add-photo-no-auth');
				}
			},
		},

		openLocation(href) {
			window.location.href = href;
		},

		/**
		 * Redirect the user to login page
		 * @param {string} trackingLabel use for tracking of event
		 * @returns {void}
		 */
		redirectToLogin(trackingLabel) {
			const sectionId = this.get('sectionId');
			let href = `/join?redirect=${encodeURIComponent(window.location.href)}`;

			if (sectionId) {
				href += encodeURIComponent(`#${sectionId}`);
			}
			href += this.getUselangParam();

			track({
				action: trackActions.click,
				category: 'sectioneditor',
				label: trackingLabel,
				value: this.get('section')
			});

			this.openLocation(href);
		},
	}
);
