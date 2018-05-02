import Component from '@ember/component';
import LanguagesMixin from '../mixins/languages';
import {track, trackActions} from '../utils/track';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(
	RenderComponentMixin,
	LanguagesMixin,
	{
		classNames: ['contribution-container'],
		layoutName: 'components/article-contribution',
		section: null,
		sectionId: null,
		title: null,

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
					this.get('edit')(this.get('title'), section);
				} else {
					this.redirectToLogin('edit-section-no-auth');
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
