/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionRouteUpvoteMixin.ts" />
/// <reference path="../mixins/ThemeMixin.ts" />

'use strict';

App.DiscussionForumRoute = Em.Route.extend(App.DiscussionRouteUpvoteMixin, App.ThemeMixin, {
	defaultSortType: null,
	forumId: null,

	activate(): void {
		Em.$('body').addClass('discussions');
		this._super();
	},

	deactivate(): void {
		Em.$('body').removeClass('discussions');
		this._super();
	},

	/**
	 * @param {*} params
	 * @returns {*}
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
	 * @returns {void}
	 */
	setupController(controller: Em.Controller, model: Em.Object, transition: EmberStates.Transition): void {
		this._super(controller, model, transition);
		this.defaultSortType = controller.get('sortTypes')[0].name;
		controller.set('sortBy', transition.params['discussion.forum'].sortBy || this.defaultSortType);
	},

	/**
	 * @param {string} sortBy
	 * @returns {EmberStates.Transition}
	 */
	setSortBy(sortBy: string): void {
		var controller = this.controllerFor('discussionForum');

		controller.set('sortBy', sortBy);

		if (controller.get('sortAlwaysVisible') !== true) {
			this.controllerFor('discussionForum').set('sortVisible', false);
		}

		return this.transitionTo('discussion.forum', this.get('forumId'), sortBy);
	},

	actions: {
		/**
		 * @param {number} postId
		 * @returns {void}
		 */
		goToPost(postId: number): void {
			var postController = this.controllerFor('discussionPost'),
				forumController = this.controllerFor('discussionForum');

			postController.set('postListSort', forumController.get('sortBy'));

			this.transitionTo('discussion.post', postId);
		},

		/**
		 * @param {number} pageNum
		 * @returns {void}
		 */
		loadPage(pageNum: number): void {
			this.modelFor('discussion.forum').loadPage(pageNum);
		},

		createPost(postData: any): any {
			this.setSortBy('latest').promise.then(() => {
				this.modelFor('discussion.forum').createPost(postData);
			});
		},

		/**
		 * @returns {void}
		 */
		retry(): void {
			this.refresh();
		},

		/**
		 * @returns {void}
		 */
		goToAllDiscussions(): void {
			this.transitionTo('discussion.index');
		},

		/**
		 * @param {string} sortBy
		 * @returns {void}
		 */
		setSortBy(sortBy: string): void {
			this.setSortBy(sortBy);
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
