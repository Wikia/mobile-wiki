App.MainPageRoute = Em.Route.extend(App.MainPageRouteMixin, {
	/**
	 * @returns {Em.RSVP.Promise}
	 */
	model() {
		return App.MainPageModel.find();
	},

	/**
	 * @param {App.MainPageModel} model
	 * @returns {void}
	 */
	afterModel(model) {
		this.controllerFor('mainPage').setProperties({
			adsContext: model.get('adsContext'),
			isRoot: true,
			ns: model.get('ns'),
			title: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});

		if (!model.isCuratedMainPage) {
			// This is needed for articles
			App.VisibilityStateManager.reset();
		}
	},

	/**
	 * @param {*} controller
	 * @param {App.MainPageModel} model
	 * @returns {void}
	 */
	renderTemplate(controller, model) {
		if (model.isCuratedMainPage) {
			this.render('main-page', {
				controller: 'mainPage',
				model
			});
		} else {
			this.render('article', {
				view: 'article',
				model
			});
		}
	},

	actions: {
		/**
		 * @param {*} error
		 * @param {EmberStates.Transition} transition
		 * @returns {boolean}
		 */
		error(error, transition) {
			if (transition) {
				transition.abort();
			}

			Em.Logger.warn('Route error', error.stack || error);
			return true;
		}
	}
});
