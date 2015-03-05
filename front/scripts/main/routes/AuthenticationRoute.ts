App.ProtectedRoute = Em.Route.extend({
	isAuthenticated: function (): boolean {
		// User is considered authenticated if session cookie exists, but this isn't 100% reliable...
		return !!$.cookie('sid');
	},

	beforeModel: function (transition): void {
		if (!this.get('isAuthenticated')) {
			var loginController = this.controllerFor('login');
			loginController.set('previousTransition', transition);
			this.transitionTo('login');
		}
	}
});

