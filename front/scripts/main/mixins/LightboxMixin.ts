/// <reference path="../app.ts" />
'use strict';

App.LightboxMixin = Em.Mixin.create({
	status: 'opening',

	didInsertElement: function (): void {
		this.set('status', 'open');

		this._super();
	},

	willDestroyElement: function (): void {
		this.get('controller').reset();

		this._super();
	}
});
