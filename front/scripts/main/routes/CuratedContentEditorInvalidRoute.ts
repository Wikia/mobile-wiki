/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorInvalidRoute = Em.Route.extend({
	/**
	 * When user tries to load invalid path under /main/edit/* we redirect to /main/edit
	 */
	beforeModel(): void {
		this.transitionTo('curatedContentEditor');
	}
});
