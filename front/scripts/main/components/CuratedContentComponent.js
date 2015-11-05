App.CuratedContentComponent = Em.Component.extend(
	App.TrackClickMixin,
	{
		classNames: ['curated-content', 'mw-content'],
		isLoading: false,

		actions: {
			/**
			 * @param {CuratedContentItem} item
			 * @returns {void}
			 */
			clickItem(item) {
				const itemType = item.type;

				if (itemType) {
					this.trackClick('modular-main-page', `curated-content-item-${itemType}`);
					if (itemType === 'section' || itemType === 'category') {
						this.sendAction('openCuratedContentItem', item);
					}
				} else {
					this.trackClick('modular-main-page', 'curated-content-item-other');
				}
			},

			/**
			 * @returns {void}
			 */
			loadMore() {
				this.set('isLoading', true);

				App.CuratedContentModel.loadMore(this.get('model'))
					.catch((reason) => {
						this.controllerFor('application').addAlert({
							message: i18n.t('app.curated-content-error-load-more-items'),
							type: 'error'
						});
						Em.Logger.error(reason);
					})
					.finally(() => {
						this.set('isLoading', false);
					});
			},
		},
	}
);
