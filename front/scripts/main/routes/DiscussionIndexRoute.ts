/// <reference path="../app.ts" />
/// <reference path="../mixins/UseNewNavMixin.ts" />
'use strict';

App.DiscussionIndexRoute = Em.Route.extend(App.UseNewNavMixin, {
	model() {
		return App.DiscussionIndexModel.find(Mercury.wiki.id);
	}
});
