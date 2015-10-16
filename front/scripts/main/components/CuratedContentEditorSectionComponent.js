App.CuratedContentEditorSectionComponent = Em.Component.extend(
	App.AlertNotificationsMixin,
	App.CuratedContentEditorSortableItemsMixin,
	App.CuratedContentThumbnailMixin,
	App.CuratedContentEditorLabelsMixin,
	App.LoadingSpinnerMixin,
	App.TrackClickMixin,
	{
		imageWidth: 300,
		thumbUrl: Em.computed('model', function() {
			return this.generateThumbUrl(this.get('model.image_url'));
		}),
		notEmptyItems: Em.computed.notEmpty('model.items'),

		actions: {
			/**
			 * @returns {void}
			 */
			addItem() {
				this.trackClick('curated-content-editor', 'section-item-add');
				this.sendAction('addItem');
			},

			/**
			 * @param {CuratedContentEditorItemModel} item item to edit
			 * @returns {void}
			 */
			editItem(item) {
				this.trackClick('curated-content-editor', 'section-item-edit');
				this.sendAction('editItem', item);
			},

			/**
			 * @returns {void}
			 */
			editSection() {
				this.trackClick('curated-content-editor', 'section-edit');
				this.sendAction('editSection', this.get('model'));
			},

			/**
			 * @returns {void}
			 */
			goBack() {
				this.trackClick('curated-content-editor', 'section-go-back');
				this.sendAction('goBack');
			},

			/**
			 * @returns {void}
			 */
			done() {
				this.trackClick('curated-content-editor', 'section-done');

				if (this.get('notEmptyItems')) {
					this.validateAndDone();
				} else {
					this.addAlert({
						message: i18n.t('app.curated-content-editor-empty-section-error'),
						type: 'alert'
					});
				}
			}
		},

		/**
		 * @returns {void}
		 */
		validateAndDone() {
			this.showLoader();
			App.CuratedContentEditorItemModel.validateServerData(
				this.get('model'),
				{method: 'validateSectionWithItems'}
			)
				.then((data) => {
					let sortableItems;

					if (data.status) {
						sortableItems = this.get('sortableItems');
						// It's done this way because sortableItems property contains not only items but also meta properties
						// which we don't want to pass to model.
						// Slice creates native JS array with only items (without meta properties).
						this.set('model.items', sortableItems.slice(0, sortableItems.length));
						this.sendAction('done', this.get('model'));
					} else if (data.error) {
						data.error.forEach((error) => this.processValidationError(error.reason));
					} else {
						this.addAlert({
							message: i18n.t('app.curated-content-error-other'),
							type: 'alert'
						});
					}
				})
				.catch((err) => {
					Em.Logger.error(err);
					this.addAlert({
						message: i18n.t('app.curated-content-error-other'),
						type: 'alert'
					});
				})
				.finally(() => this.hideLoader());
		},

		/**
		 * @param {String} reason error reason
		 * @returns {void}
		 */
		processValidationError(reason) {
			if (reason === 'itemsMissing') {
				this.addAlert({
					message: i18n.t('app.curated-content-editor-empty-section-error'),
					type: 'alert'
				});
			} else {
				// if other items occur that means user somehow bypassed validation of one or more items earlier
				this.addAlert({
					message: i18n.t('app.curated-content-editor-general-section-error'),
					type: 'alert'
				});
			}
		}
	});
