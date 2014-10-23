/// <reference path="../app.ts" />
'use strict';

App.WikiaUsersComponent = Em.Component.extend({
	avatarHeight: 100,
	avatarWidth: 100,
	classNameBindings: ['additionalClasses'],
	label: null,
	limit: 5,
	thumbMode: Mercury.Modules.Thumbnailer.mode.fixedAspectRatio,
	trackingEvent: null,
	users: [],

	isVisible: function (): boolean {
		return this.get('users').length > 0;
	}.property('users')
});
