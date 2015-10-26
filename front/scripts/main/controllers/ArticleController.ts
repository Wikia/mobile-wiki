/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../mixins/VisibilityStateManager.ts" />
'use strict';

App.ArticleController = Em.Controller.extend({
	application: Em.inject.controller(),
	noAds: Em.computed.alias('application.noAds'),
	commentsPage: Em.computed.alias('application.commentsPage'),

	/**
	 * @returns {undefined}
	 */
	init(): void {
		this.setProperties({
			mainPageTitle: Em.get(Mercury, 'wiki.mainPageTitle'),
			siteName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});
	},

	actions: {

		/**
		 * @param title {string}
		 * @param sectionIndex {number}
		 * @returns {undefined}
		 */
		edit(title: string, sectionIndex: number): void {
			App.VisibilityStateManager.reset();
			this.transitionToRoute('articleEdit', title, sectionIndex);
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'edit',
				value: sectionIndex
			});
		},

		/**
		 * @param title {string}
		 * @param sectionIndex {number}
		 * @param photoData {any}
		 * @returns {undefined}
		 */
		addPhoto(title: string, sectionIndex: number, photoData: any): void {
			var photoModel = App.ArticleAddPhotoModel.load(photoData);
			//We don't want to hold with transition and wait for a promise to resolve.
            //Instead we set properties on model after resolving promise and Ember scheduler
            // handles this gracefully.
			photoModel.then((model: typeof App.ArticleAddPhotoModel) => {
				model.setProperties({
					title,
					sectionIndex
				});
			});
			this.transitionToRoute('articleAddPhoto', photoModel);
		},

		/**
		 * @returns {undefined}
		 */
		articleRendered(): void {
			this.send('handleLightbox');
		}
	}
});
