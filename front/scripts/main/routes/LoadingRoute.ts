/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.LoadingRoute = Em.Route.extend({
	/**
	 * This is the default route to enter while waiting for a model to resolve.
	 * There's also a loading-spinner component that can be called on demand.
	 * @see http://guides.emberjs.com/v1.10.0/routing/loading-and-error-substates/
	 */
	templateName: 'components/loading-spinner'
});
