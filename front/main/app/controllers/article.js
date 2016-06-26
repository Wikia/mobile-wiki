import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

import {getGroup} from 'common/modules/abtest';
import ArticleAddPhotoModel from '../models/article-add-photo';
import VisibilityStateManager from '../utils/visibility-state-manager';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	noAds: Ember.computed.alias('application.noAds'),
	commentsPage: Ember.computed.alias('application.commentsPage'),
	// used for ad viewability on infobox page experiment, should be removed as part of DAT-4487
	showTopLeaderBoardAd: false,

	/**
	 * @returns {void}
	 */
	init() {
		const viewabilityExperimentGroup = getGroup('MERCURY_VIEWABILITY_EXPERIMENT');

		this.setProperties({
			// used for ad viewability on infobox page experiment, should be removed as part of DAT-4487
			showTopLeaderBoardAd: !(viewabilityExperimentGroup === 'AD_BELOW_INFOBOX' ||
				viewabilityExperimentGroup === 'AD_ON_PAGE_FOLD'),
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
