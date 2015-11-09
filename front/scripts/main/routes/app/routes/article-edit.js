App.ArticleEditRoute = Em.Route.extend(App.FullPageMixin, {
	/**
	 * @param {*} params
	 * @returns {Em.RSVP.Promise}
	 */
	model(params) {
		return App.ArticleEditModel.load(params.title, params.sectionIndex);
	},

	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('article-edit', {
			controller: 'articleEdit'
		});
	},

	actions: {
		/**
		 * @returns {boolean}
		 */
		error() {
			this.controllerFor('application').addAlert({
				message: i18n.t('app.edit-load-error'),
				type: 'alert'
			});

			M.track({
				action: M.trackActions.impression,
				category: 'sectioneditor',
				label: 'edit-load-error'
			});

			return true;
		}
	}
});
