/// <reference path='../../../../typings/ember/ember.d.ts' />
/// <reference path='../app.ts' />
'use strict';

interface Window {
	define: any
}

/**
 * This mixin is needed as libs used by us will initialize themself as modules if define.amd is truthy
 * define.amd might be truthy here if ads code is loaded before
 *
 * This will be not needed when we move to module system
 *
 * @type {Ember.Mixin}
 */
App.AmdMixin = Em.Mixin.create({

	/**
	* @param {JQueryXHR} promise
	* @returns {JQueryXHR}
	 */
	suppressDefineAmd(promise: JQueryXHR) {
		var oldAmd: any;

		if (window.define) {
			oldAmd = window.define.amd;
			window.define.amd = false;

			promise.then((): void => {
				window.define.amd = oldAmd;
			});
		}
	},

});
