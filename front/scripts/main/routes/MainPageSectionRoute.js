App.MainPageSectionRoute = Em.Route.extend(App.MainPageRouteMixin, App.MetaTagsMixin, {
	/**
	 * @param {*} params
	 * @returns {Em.RSVP.Promise}
	 */
	model(params) {
		return App.CuratedContentModel.find(params.sectionName, 'section');
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
			if (error && error.status === 404) {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.curated-content-error-section-not-found'),
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
