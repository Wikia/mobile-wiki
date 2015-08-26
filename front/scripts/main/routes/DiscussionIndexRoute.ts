/// <reference path="../app.ts" />

App.DiscussionIndexRoute = Em.Route.extend({
	model() {
		return App.DiscussionIndexModel.find(Mercury.wiki.id);
	},
	actions: {
		willTransition: function(transition: EmberStates.Transition): boolean {
			transition.then(() => {
				this.controllerFor('application').set('fullPage', false);
			});
			return true;
		},
		didTransition: function(): boolean {
			this.controllerFor('application').set('fullPage', true);
			return true;
		}
	}
});
