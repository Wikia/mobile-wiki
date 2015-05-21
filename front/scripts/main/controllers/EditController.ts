/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.EditController = Em.Controller.extend({
	needs: ['application'],

	// FIXME: Cover more errors
	errorCodeMap: {
		'autoblockedtext': 'app.edit-publish-error-autoblockedtext',
		'blocked': 'app.edit-publish-error-blocked',
		'noedit': 'app.edit-publish-error-noedit',
		'noedit-anon': 'app.edit-publish-error-noedit-anon',
		'protectedpage': 'app.edit-publish-error-protectedpage'
	},

	handlePublishError (error: any): void {
		var appController = this.get('controllers.application'),
			errorMsg = this.errorCodeMap[error] || 'app.edit-publish-error'

		appController.addAlert('alert', i18n.t(errorMsg));
		appController.hideLoader();
	},

	actions: {
		publish: function (): void {
			this.get('controllers.application').showLoader();
			App.EditModel.publish(this.model)
				.then((data: any): void => {
					this.transitionToRoute('article', this.model.title).then(() => {
						this.get('controllers.application').addAlert('success', i18n.t('app.edit-success', {pageTitle: this.model.title}));
					})
				}, this.handlePublishError.bind(this));
		}
	},
});
