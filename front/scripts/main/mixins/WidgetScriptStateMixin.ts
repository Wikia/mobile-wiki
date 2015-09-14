/// <reference path='../../../../typings/ember/ember.d.ts' />
/// <reference path='../app.ts' />
'use strict';

App.WidgetScriptStateMixin = Em.Mixin.create({
	/**
	 * This state is shared between objects that use the mixin.
	 * It's used to load external scripts only once even if there are multiple instances of a single component.
	 */
	scriptLoadInitialized: {
		twitter: false
	},

	/**
	 * This state is shared between objects that use the mixin.
	 * It's used to update every instance of given component after external script is loaded.
	 */
	scriptLoaded: {
		twitter: false
	}
});
