import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { track, trackActions } from '../utils/track';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(
	RenderComponentMixin,
	{
		wikiUrls: service(),

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
				const section = this.section;

				if (this.editAllowed) {
					track({
						action: trackActions.click,
						category: 'sectioneditor',
						label: 'edit',
						value: section
					});
					this.edit(this.title, section);
				} else {
					track({
						action: trackActions.click,
						category: 'sectioneditor',
						label: 'edit-section-no-auth',
						value: this.section
					});
					this.wikiUrls.goToLogin(`${window.location.href}#${this.sectionId}`);
				}
			},
		}
	}
);
