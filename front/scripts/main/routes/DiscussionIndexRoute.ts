/// <reference path="../app.ts" />
/// <reference path="../mixins/FullPageMixin.ts"/>
'use strict';

App.DiscussionIndexRoute = Em.Route.extend({
	model() {
		return App.DiscussionIndexModel.find(Mercury.wiki.id);
	},
	activate() {
		// roll out new top-bar component
		this.controllerFor('application').set('useNewNav', true);
	},
	deactivate() {
		// roll out new top-bar component
		this.controllerFor('application').set('useNewNav', false);
	}
});
