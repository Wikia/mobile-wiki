import Ember from 'ember';
import {track, trackActions} from '../utils/track';

const {Controller, computed, inject} = Ember;

export default Controller.extend({
	application: inject.controller(),
	wikiVariables: inject.service(),

	commentsPage: computed.alias('application.commentsPage'),
	mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),
	siteName: computed.reads('wikiVariables.siteName'),

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
		}
	}
});
