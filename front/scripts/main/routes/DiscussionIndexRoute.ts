/// <reference path="../app.ts" />
/// <reference path="../mixins/FullPageMixin.ts"/>
'use strict';

App.DiscussionIndexRoute = Em.Route.extend({
	model() {
		return App.DiscussionIndexModel.find(Mercury.wiki.id);
	},
	activate() {
		this.controllerFor('application').set('useNewNav', true);
	},
	deactivate() {
		this.controllerFor('application').set('useNewNav', false);
	}
});
