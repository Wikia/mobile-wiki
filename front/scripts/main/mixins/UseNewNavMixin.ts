/// <reference path="../app.ts" />
'use strict';

/**
 * As we roll out the new top-bar custom component, we'll be controlling it's use via the `useNewNav` property on the
 * ApplicationController. Once we've rolled it out everywhere, we can remove this code.
 */
App.UseNewNavMixin = Em.Mixin.create({
	activate(): void {
		this.controllerFor('application').set('useNewNav', true);
		this._super();
	},
	deactivate(): void {
		this.controllerFor('application').set('useNewNav', false);
		this._super();
	}
});
