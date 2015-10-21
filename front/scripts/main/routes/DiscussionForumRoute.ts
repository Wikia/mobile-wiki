/// <reference path="../app.ts" />
/// <reference path="../mixins/UseNewNavMixin.ts" />
/// <reference path="../mixins/DiscussionRouteUpvoteMixin.ts" />
'use strict';

App.DiscussionForumRoute = Em.Route.extend(App.UseNewNavMixin, App.DiscussionRouteUpvoteMixin, {
	defaultSortType: null,
	forumId: null,

	/**
	 * @param {*} params
	 * @returns {any}
	 */
	model(params: any): any {
		var sortBy: string;
		this.set('forumId', params.forumId);

		sortBy = params.sortBy || this.defaultSortType;
		return App.DiscussionForumModel.find(Mercury.wiki.id, params.forumId, sortBy);
	},

	/**
	 * @param {Em.Controller} controller
	 * @param {Em.Object} model
	 * @param {EmberStates.Transition} transition
	 * @returns {undefined}
	 */
	setupController(controller: Em.Controller, model: Em.Object, transition: EmberStates.Transition): void {
		this._super(controller, model, transition);
		this.defaultSortType = controller.get('sortTypes')[0].name;
		controller.set('sortBy', transition.params['discussion.forum'].sortBy || this.defaultSortType);
	},

	actions: {
		/**
		 * @param {number} postId
		 * @returns {undefined}
		 */
		goToPost(postId: number): void {
			var postController = this.controllerFor('discussionPost'),
				forumController = this.controllerFor('discussionForum');

			postController.set('postListSort', forumController.get('sortBy'));

			this.transitionTo('discussion.post', postId);
		},

		/**
		 * @param {number} pageNum
		 * @returns {undefined}
		 */
		loadPage(pageNum: number): void {
			this.modelFor('discussion.forum').loadPage(pageNum);
		},

		/**
		 * @returns {undefined}
		 */
		retry(): void {
			this.refresh();
		},

		/**
		 * @returns {undefined}
		 */
		goToAllDiscussions(): void {
			this.transitionTo('discussion.index');
		},

		/**
		 * @param {string} sortBy
		 * @returns {undefined}
		 */
		setSortBy(sortBy: string): void {
			var controller = this.controllerFor('discussionForum');

			controller.set('sortBy', sortBy);

			if (controller.get('sortAlwaysVisible') !== true) {
				this.controllerFor('discussionForum').set('sortVisible', false);
			}

			this.transitionTo('discussion.forum', this.get('forumId'), sortBy);
		},

		/**
		 * @returns {boolean}
		 */
		didTransition(): boolean {
			this.controllerFor('application').set('noMargins', true);
			return true;
		}
	}
});
