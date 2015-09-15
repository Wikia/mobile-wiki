/// <reference path="../app.ts" />
/// <reference path="../mixins/FullPageMixin.ts"/>
'use strict';

App.DiscussionForumRoute = Em.Route.extend(App.FullPageMixin, {
	forumId: null,

	model(params: any) {
		this.set('forumId', params.forumId);
		return App.DiscussionForumModel.find(Mercury.wiki.id, params.forumId, params.sortBy);
	},

	setupController(controller: Em.Controller, model: Em.Object, transition: EmberStates.Transition) {
		this._super(controller, model, transition);
		controller.set('sortBy', transition.params['discussion.forum'].sortBy);
	},

	actions: {
		goToPost: function (postId: number): void {
			this.transitionTo('discussion.post', postId);
		},

		loadPage: function (pageNum: number): void {
			this.modelFor('discussion.forum').loadPage(pageNum);
		},

		setSortBy: function (sortBy: string): void {
			this.controllerFor('discussionForum').set('sortBy', sortBy);
			this.transitionTo('discussion.forum', this.get('forumId'), sortBy);
		}
	}
});
