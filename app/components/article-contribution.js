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
					track({
						action: trackActions.click,
						category: 'sectioneditor',
						label: 'edit-section-no-auth',
						value: this.get('section')
					});
					this.get('wikiUrls').goToLogin(`${window.location.href}#${this.get('sectionId')}`);
				}
			},
		}
	}
);
