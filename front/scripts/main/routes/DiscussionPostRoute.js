App.DiscussionPostRoute = Em.Route.extend(App.DiscussionRouteUpvoteMixin, {
	/**
	 * @param {*} params
	 * @returns {Em.RSVP.Promise}
	 */
	model(params) {
		return App.DiscussionPostModel.find(Mercury.wiki.id, params.postId);
	},

	/**
	 * @param {App.DiscussionPostModel} model
	 * @returns {void}
	 */
	afterModel(model) {
		let title = model.get('title');

		if (!title) {
			title = i18n.t('discussion.share-default-title', {siteName: Mercury.wiki.siteName});
		}

		this.controllerFor('application').set('currentTitle', title);
	},

	/**
	 * @returns {void}
	 */
	activate() {
		this.controllerFor('application').setProperties({
			// Enables vertical-colored theme bar in site-head component
			themeBar: true,
			enableShareHeader: false
		});
		Em.$('body').addClass('discussions');
		this._super();
	},

	/**
	 * @returns {void}
	 */
	deactivate() {
		this.controllerFor('application').setProperties({
			// Disables vertical-colored theme bar in site-head component
			themeBar: false,
			enableShareHeader: false
		});
		Em.$('body').removeClass('discussions');
		this._super();
	},

	actions: {
		/**
		 * @returns {void}
		 */
		retry() {
			this.refresh();
		},

		/**
		 * @returns {void}
		 */
		goToAllDiscussions() {
			this.transitionTo('discussion.index');
		},

		/**
		 * @returns {boolean}
		 */
		didTransition() {
			this.controllerFor('application').set('noMargins', true);
			return true;
		},

		/**
		 * @param {number} forumId
		 * @param {string} sort
		 * @returns {void}
		 */
		goToForum(forumId, sort) {
			this.transitionTo('discussion.forum', forumId, sort);
		},
	}
});
