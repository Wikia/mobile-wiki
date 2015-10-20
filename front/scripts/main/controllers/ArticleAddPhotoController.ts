/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.ArticleAddPhotoController = Em.Controller.extend({
	application: Em.inject.controller(),

	errorCodeMap: {
		'invalidtitle': 'app.add-photo-section-title-error',
		'noedit': 'app.edit-publish-error-noedit',
		'noedit-anon': 'app.edit-publish-error-noedit-anon'
	},

	/**
	 * @returns {void}
	 */
	handleAddContentSuccess(): void {
		var title = this.get('model.title');
		this.transitionToRoute('article', title).then((): void => {
			this.get('application').addAlert({
				message: i18n.t('app.add-photo-success'),
				type: 'success'
			});
		});
		M.track({
			action: M.trackActions.impression,
			category: 'sectionaddphoto',
			label: 'success'
		});
	},

	/**
	 * @param data {any}
	 * @returns {void}
	 */
	handleUploadSuccess(data: any): void {
		App.ArticleAddPhotoModel.addToContent(data.title, this.get('model')).then(
			this.handleAddContentSuccess.bind(this),
			this.handleError.bind(this)
		);
	},

	/**
	 * @param error {any}
	 * @returns {void}
	 */
	handleError(error: any): void {
		var appController = this.get('application'),
			errorMsg = this.errorCodeMap[error] || 'app.add-photo-error';

		appController.addAlert({
			message: i18n.t(errorMsg),
			type: 'alert'
		});
		appController.hideLoader();

		M.track({
			action: M.trackActions.impression,
			category: 'sectionaddphoto',
			label: error || 'add-photo-error'
		});
	},

	actions: {
		/**
		 * @returns {void}
		 */
		upload(): void {
			this.get('application').showLoader();
			App.ArticleAddPhotoModel.upload(this.get('model')).then(
				this.handleUploadSuccess.bind(this),
				this.handleError.bind(this)
			);
		},

		/**
		 * @returns {void}
		 */
		back(): void {
			this.transitionToRoute('article', this.get('model.title'));
		}
	}
});
