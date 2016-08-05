import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';
import ArticleAddPhotoModel from '../models/article-add-photo';
import VisibilityStateManager from '../utils/visibility-state-manager';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	commentsPage: Ember.computed.alias('application.commentsPage'),

	/**
	 * @returns {void}
	 */
	init() {
		this.setProperties({
			mainPageTitle: Ember.get(Mercury, 'wiki.mainPageTitle'),
			siteName: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});
	},

	actions: {
		/**
		 * @param {string} title
		 * @param {number} sectionIndex
		 * @returns {void}
		 */
		edit(title, sectionIndex) {
			VisibilityStateManager.reset();
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
