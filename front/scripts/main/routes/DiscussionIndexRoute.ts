/// <reference path="../app.ts" />
/// <reference path="../mixins/UseNewNavMixin.ts" />
'use strict';

App.DiscussionIndexRoute = Em.Route.extend(App.UseNewNavMixin, {
	beforeModel(): void {
		this.transitionTo('discussion.forum', {
			forumId: Mercury.wiki.id,
			sortBy: ''
		});
	},

	model() {
		return App.DiscussionIndexModel.find(Mercury.wiki.id);
	}
});
