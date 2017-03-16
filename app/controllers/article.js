import Ember from 'ember';
import {track, trackActions} from '../utils/track';
import ArticleAddPhotoModel from '../models/article-add-photo';

const {Controller, computed, inject} = Ember;

export default Controller.extend({
	application: inject.controller(),
	wikiVariables: inject.service(),

	commentsPage: computed.alias('application.commentsPage'),
	mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),
	siteName: computed('wikiVariables', function () {
		return this.get('wikiVariables.siteName') || 'Fandom powered by Wikia';
	}),

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
		 * @param {string} title
		 * @param {number} sectionIndex
		 * @param {*} photoData
		 * @returns {void}
		 */
		addPhoto(title, sectionIndex, photoData) {
			const photoModel = ArticleAddPhotoModel.load(photoData);

			// We don't want to hold with transition and wait for a promise to resolve.
			// Instead we set properties on model after resolving promise and Ember scheduler
			// handles this gracefully.
			photoModel.then((model) => {
				model.setProperties({
					title,
					sectionIndex
				});
			});

			this.transitionToRoute('articleAddPhoto', photoModel);
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
