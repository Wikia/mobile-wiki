import Ember from 'ember';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';
import {track, trackActions} from '../utils/track';

const {Controller, computed, inject} = Ember;

export default Controller.extend(WikiPageControllerMixin, {
	application: inject.controller(),

	commentsPage: computed.alias('application.commentsPage'),

	actions: {
		/**
		 * @param {string} title
		 * @param {number} sectionIndex
		 * @returns {void}
		 */
		edit(title, sectionIndex) {
			this.transitionToRoute('articleEdit', title, sectionIndex);

			track({
				action: trackActions.click,
				category: 'sectioneditor',
				label: 'edit',
				value: sectionIndex
			});
		},

		/**
		 * @returns {void}
		 */
		articleRendered() {
			this.send('handleLightbox');
		},

		trackClick(category, label) {
			track({
				action: trackActions.click,
				category,
				label
			});
		},

		toggleSiteHeadShadow(visible) {
			this.get('application').send('toggleSiteHeadShadow', visible);
		}
	}
});
