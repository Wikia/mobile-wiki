App.MainPageCategoryRoute = Em.Route.extend(App.MainPageRouteMixin, App.MetaTagsMixin, {
	/**
	 * @param {*} params
	 * @returns {Em.RSVP.Promise}
	 */
	model(params) {
		return App.CuratedContentModel.find(params.categoryName, 'category');
	},

	/**
	 * @returns {*}
	 */
	meta() {
		return {
			name: {
				robots: 'noindex, follow'
			}
		};
	},

	actions: {
		/**
		 * @param {*} error
		 * @returns {boolean}
		 */
		error(error) {
			// Status comes from ArticlesApiController::getList in MediaWiki
			// and code comes from MercuryApiController in MW and server side code in Mercury app
			if (error && (error.status === 404 || error.code === 404)) {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.curated-content-error-category-not-found'),
					type: 'warning',
					persistent: true,
				});
			} else {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.curated-content-error-other'),
					type: 'warning',
					persistent: true,
				});
			}

			this.transitionTo('mainPage');
			return true;
		}
	}
});
