App.DiscussionForumRoute = Em.Route.extend(App.DiscussionRouteUpvoteMixin, {
	defaultSortType: null,
	forumId: null,

	activate() {
		Em.$('body').addClass('discussions');
	},

	deactivate() {
		Em.$('body').removeClass('discussions');
	},

	/**
	 * @param {*} params
	 * @returns {*}
	 */
	model(params) {
		const sortBy = params.sortBy || this.defaultSortType;

		this.set('forumId', params.forumId);

		return App.DiscussionForumModel.find(Mercury.wiki.id, params.forumId, sortBy);
	},

	/**
	 * @param {Em.Controller} controller
	 * @param {Em.Object} model
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		this._super(controller, model, transition);
		this.defaultSortType = controller.get('sortTypes')[0].name;
		controller.set('sortBy', transition.params['discussion.forum'].sortBy || this.defaultSortType);
	},

	actions: {
		/**
		 * @param {number} postId
		 * @returns {void}
		 */
		goToPost(postId) {
			const postController = this.controllerFor('discussionPost'),
				forumController = this.controllerFor('discussionForum');

			postController.set('postListSort', forumController.get('sortBy'));

			this.transitionTo('discussion.post', postId);
		},

		/**
		 * @param {number} pageNum
		 * @returns {void}
		 */
		loadPage(pageNum) {
			this.modelFor('discussion.forum').loadPage(pageNum);
		},

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
		 * @param {string} sortBy
		 * @returns {void}
		 */
		setSortBy(sortBy) {
			const controller = this.controllerFor('discussionForum');

			controller.set('sortBy', sortBy);

			if (controller.get('sortAlwaysVisible') !== true) {
				this.controllerFor('discussionForum').set('sortVisible', false);
			}

			this.transitionTo('discussion.forum', this.get('forumId'), sortBy);
		},

		/**
		 * @returns {boolean}
		 */
		didTransition() {
			this.controllerFor('application').set('noMargins', true);
			return true;
		}
	}
});
