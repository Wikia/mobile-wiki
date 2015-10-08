/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.ArticleEditController = Em.Controller.extend({
	application: Em.inject.controller(),

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

	handlePublishSuccess (): void {
		var title = this.get('model.title');
		this.transitionToRoute('article', title).then((): void => {
			this.get('application').addAlert({
				message: i18n.t('app.edit-success', { pageTitle: title }),
				type: 'success'
			});
			this.set('isPublishing', false);
		});

		M.track({
			action: M.trackActions.impression,
			category: 'sectioneditor',
			label: 'success'
		});
	},

	handlePublishError (error: any): void {
		var appController = this.get('application'),
			errorMsg = this.errorCodeMap[error] || 'app.edit-publish-error';

		appController.addAlert({
			message: i18n.t(errorMsg),
			type: 'alert'
		});
		appController.hideLoader();

		this.set('isPublishing', false);

		M.track({
			action: M.trackActions.impression,
			category: 'sectioneditor',
			label: error || 'edit-publish-error'
		});
	},

	actions: {
		publish(): void {
			this.set('isPublishing', true);
			this.get('application').showLoader();
			App.ArticleEditModel.publish(this.get('model')).then(
				this.handlePublishSuccess.bind(this),
				this.handlePublishError.bind(this)
			);
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'publish'
			});
		},
		back(): void {
			this.transitionToRoute('article', this.get('model.title'));
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'back',
				value: this.get('publishDisabled')
			});
		}
	}
});
