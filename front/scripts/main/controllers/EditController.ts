/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.EditController = Em.Controller.extend({
	needs: ['application'],

	isPublishing: false,

	publishDisabled: Em.computed('isPublishing', 'model.isDirty', function (): boolean {
		return (this.get('isPublishing') === true || this.get('model.isDirty') === false);
	}),

	// FIXME: Cover more errors
	errorCodeMap: {
		'autoblockedtext': 'app.edit-publish-error-autoblockedtext',
		'blocked': 'app.edit-publish-error-blocked',
		'noedit': 'app.edit-publish-error-noedit',
		'noedit-anon': 'app.edit-publish-error-noedit-anon',
		'protectedpage': 'app.edit-publish-error-protectedpage'
	},

	handlePublishSuccess (data: any): void {
		var title = this.get('model.title');
		this.transitionToRoute('article', title).then((): void => {
			this.get('controllers.application').addAlert('success', i18n.t('app.edit-success', {pageTitle: title}));
			this.set('isPublishing', false);
		});

		M.track({
			action: M.trackActions.impression,
			category: 'sectioneditor',
			label: 'success'
		});
	},

	handlePublishError (error: any): void {
		var appController = this.get('controllers.application'),
			errorMsg = this.errorCodeMap[error] || 'app.edit-publish-error';

		appController.addAlert('alert', i18n.t(errorMsg));
		appController.hideLoader();

		this.set('isPublishing', false);

		M.track({
			action: M.trackActions.impression,
			category: 'sectioneditor',
			label: error || 'edit-publish-error'
		});
	},

	actions: {
		publish: function (): void {
			this.set('isPublishing', true);
			this.get('controllers.application').showLoader();
			App.EditModel.publish(this.get('model')).then(
				this.handlePublishSuccess.bind(this),
				this.handlePublishError.bind(this)
			);
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'publish'
			});
		},
		back: function (): void {
			this.transitionToRoute('article', this.get('model.title'));
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'back',
				value: this.get('publishDisabled')
			});
		}
	},
});
