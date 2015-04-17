/// <reference path="../app.ts" />
'use strict';

App.LoadingSpinnerMixin = Em.Mixin.create({
	isLoading: false,
	spinnerDelay: 300,
	spinnerTimeout: null,

	/**
	 * show loader with some small delay
	 * if we are able to load it under the delay
	 * perceived speed of applications is better
	 * if not, small delay will be almost unnoticeable
	 */
	showLoader: function () {
		console.log("LoadingSpinnerMixin: showLoader")
		this.set('spinnerTimeout', Em.run.later(this, (): void => {
			this.set('isLoading', true);
		}, this.spinnerDelay));
	},

	hideLoader: function () {
		console.log("LoadingSpinnerMixin: hideLoader")
		Em.run.cancel(this.get('spinnerTimeout'));
		this.set('isLoading', false);
	}
});
