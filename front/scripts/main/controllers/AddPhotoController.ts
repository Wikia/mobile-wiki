/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.AddPhotoController = Em.Controller.extend({
	needs: ['application', 'article'],

	errorCodeMap: {
		'invalidtitle': 'app.add-photo-section-title-error'
	},

	handleAddContentSuccess: function(data: any): void {
		var title = this.get('model.title');
		this.transitionToRoute('article', title).then((): void => {
			this.get('controllers.application').addAlert({
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

	handleUploadSuccess: function(data: any): void {
		App.AddPhotoModel.addToContent(data.title, this.get('model')).then(
			this.handleAddContentSuccess.bind(this),
			this.handleError.bind(this)
		);
	},

	handleError: function(error: any): void {
		var appController = this.get('controllers.application'),
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
		upload: function (): void {
			this.get('controllers.application').showLoader();
			App.AddPhotoModel.upload(this.get('model')).then(
				this.handleUploadSuccess.bind(this),
				this.handleError.bind(this)
			);

			M.track({
				action: M.trackActions.click,
				category: 'sectionaddphoto',
				label: 'upload'
			});
		},

		back: function (): void {
			this.transitionToRoute('article', this.get('model.title'));
			M.track({
				action: M.trackActions.click,
				category: 'sectionaddphoto',
				label: 'back'
			});
		}
	}
});
