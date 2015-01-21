/// <reference path="../app.ts" />
/// <reference path="./VisibilityStateManager.ts" />

/**
 * Mixin that sends 'onVisible' action when element appears on screen for the first time.
 *
 */
'use strict';

App.VisibleMixin = Em.Mixin.create({
	init: function () {
		this._super();

		App.VisibilityStateManager.add(this);
	}
});
