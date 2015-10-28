App.CuratedContentEditorComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.TrackClickMixin,
	{
		classNames: ['curated-content-editor'],

		actions: {
			/**
			 * @param {string} block
			 * @returns {undefined}
			 */
			addBlockItem(block) {
				this.sendAction('addBlockItem', block);
			},

			/**
			 * @returns {undefined}
			 */
			addSection() {
				this.sendAction('addSection');
			},

			/**
			 * @param {CuratedContentEditorItemModel} item
			 * @param {string} block
			 * @returns {undefined}
			 */
			editBlockItem(item, block) {
				this.sendAction('editBlockItem', item, block);
			},

			/**
			 * @returns {undefined}
			 */
			openMainPage() {
				this.sendAction('openMainPage');
			},

			/**
			 * @param {CuratedContentEditorItemModel} section
			 * @returns {undefined}
			 */
			openSection(section) {
				this.sendAction('openSection', section);
			},

			/**
			 * @returns {undefined}
			 */
			save() {
				this.trackClick('curated-content-editor', 'save');
				this.validateAndSave();
			}
		},

		/**
		 * @returns {undefined}
		 */
		validateAndSave() {
			this.set('isLoading', true);

			App.CuratedContentEditorModel.save(this.get('model'))
				.then((data) => {
					if (data.status) {
						this.addAlert({
							message: i18n.t('app.curated-content-editor-changes-saved'),
							type: 'info'
						});

						this.sendAction('openMainPage', true);
					} else if (data.error) {
						data.error.forEach(
							(error) => this.processValidationError(error.type, error.reason)
						);
					} else {
						this.addAlert({
							message: i18n.t('app.curated-content-error-other'),
							type: 'alert'
						});
					}
				})
				.catch((err) => {
					if (err.status === 403) {
						this.addAlert({
							message: i18n.t('app.curated-content-editor-error-no-save-permissions'),
							type: 'warning'
						});
					} else {
						Em.Logger.error(err);
						this.addAlert({
							message: i18n.t('app.curated-content-error-other'),
							type: 'alert'
						});
					}
				})
				.finally(() => {
					this.set('isLoading', false);
				});
		},


		/**
		 * @param {string} type
		 * @param {string} reason
		 * @returns {undefined}
		 */
		processValidationError(type, reason) {
			if (type === 'featured') {
				this.addAlert({
					message: i18n.t('app.curated-content-editor-error-inside-featured-content'),
					type: 'alert'
				});
			} else if (reason === 'itemsMissing') {
				this.addAlert({
					message: i18n.t('app.curated-content-editor-missing-items-error'),
					type: 'alert'
				});
			} else {
				// if other items occur that means user somehow bypassed validation of one or more items earlier
				this.addAlert({
					message: i18n.t('app.curated-content-editor-error-inside-items-message'),
					type: 'alert'
				});
			}
		}
	}
);
