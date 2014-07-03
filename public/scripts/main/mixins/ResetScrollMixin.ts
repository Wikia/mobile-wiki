/// <reference path="../app.ts" />

'use strict'

App.ResetScroll = Ember.Mixin.create({
	afterModel: function () {
		this._super();
		window.scrollTo(0,0);
	}
});
