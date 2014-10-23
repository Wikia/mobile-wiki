/// <reference path="../app.ts" />
'use strict';

App.WikiaUsersComponent = Em.Component.extend({
	classNames: ['wikia-users'],
	classNameBindings: ['additionalClasses'],
	label: null,
	limit: 5,
	thumbHeight: 100,
	thumbMode: Mercury.Modules.Thumbnailer.mode.fixedAspectRatio,
	thumbWidth: 100,
	trackingEvent: null,
	users: [],

	isVisible: function (): boolean {
		return this.get('users').length > 0;
	}.property('users')
});
