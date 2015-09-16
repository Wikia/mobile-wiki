/// <reference path="../app.ts" />
/// <reference path="../mixins/UseNewNavMixin.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />
'use strict';

App.DiscussionForumRoute = Em.Route.extend(App.UseNewNavMixin, App.ViewportMixin, {
	forumId: null,

	model(params: any) {
		this.set('forumId', params.forumId);
		return App.DiscussionForumModel.find(Mercury.wiki.id, params.forumId, params.sortBy);
	},

	setupController(controller: Em.Controller, model: Em.Object, transition: EmberStates.Transition) {
		this._super(controller, model, transition);
		controller.set('sortBy', transition.params['discussion.forum'].sortBy || controller.get('sortTypes')[0].name);
	},

	viewportObserver: Em.observer('viewportDimensions.width', function (): void {
		this.updateSortVisibility();
	}),

	updateSortVisibility: function (): void {
		var controller = this.controllerFor('discussionForum');

		if (this.get('viewportDimensions.width') >= this.get('breakpoints.desktop')) {
			controller.setProperties({
				sortAlwaysVisible: true,
				sortVisible: true
			});
		} else {
			controller.set('sortAlwaysVisible', false);
		}
	},

	activate: function (): void {
		this.updateSortVisibility();
		this._super();
	},

	actions: {
		goToPost: function (postId: number): void {
			this.transitionTo('discussion.post', postId);
		},

		loadPage: function (pageNum: number): void {
			this.modelFor('discussion.forum').loadPage(pageNum);
		},

		setSortBy: function (sortBy: string): void {
			var controller = this.controllerFor('discussionForum');

			controller.set('sortBy', sortBy);

			if (controller.get('sortAlwaysVisible') !== true) {
				this.controllerFor('discussionForum').set('sortVisible', false);
			}

			this.transitionTo('discussion.forum', this.get('forumId'), sortBy);
		}
	}
});
