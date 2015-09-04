/// <reference path="../app.ts" />
/// <reference path="../mixins/FullPageMixin.ts"/>
'use strict';

App.DiscussionIndexRoute = Em.Route.extend(App.FullPageMixin, {
	model () {
		return App.DiscussionIndexModel.find(Mercury.wiki.id);
	}
});
