App.ArticleAddPhotoController = Em.Controller.extend({
	application: Em.inject.controller(),

	errorCodeMap: {
		invalidtitle: 'app.add-photo-section-title-error',
		noedit: 'app.edit-publish-error-noedit',
		'noedit-anon': 'app.edit-publish-error-noedit-anon'
	},

	/**
	 * @returns {void}
	 */
	handleAddContentSuccess() {
		const title = this.get('model.title');

		this.transitionToRoute('article', title).then(() => {
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
	 * @param {*} data
	 * @returns {void}
	 */
	handleUploadSuccess(data) {
		App.ArticleAddPhotoModel.addToContent(data.title, this.get('model')).then(
			this.handleAddContentSuccess.bind(this),
			this.handleError.bind(this)
		);
	},

	/**
	 * @param {*} error
	 * @returns {void}
	 */
	handleError(error) {
		const appController = this.get('application'),
			errorMsg = this.errorCodeMap[error] || 'app.add-photo-error';

		appController.addAlert({
			message: i18n.t(errorMsg),
			type: 'alert'
		});

		appController.set('isLoading', false);

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
		upload() {
			this.get('application').set('isLoading', true);

			App.ArticleAddPhotoModel.upload(this.get('model')).then(
				this.handleUploadSuccess.bind(this),
				this.handleError.bind(this)
			);
		},

		/**
		 * @returns {void}
		 */
		back() {
			this.transitionToRoute('article', this.get('model.title'));
		}
	}
});
