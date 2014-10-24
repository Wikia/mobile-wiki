/// <reference path="../app.ts" />
'use strict';

App.WikiaUsersComponent = Em.Component.extend({
	avatarHeight: 100,
	avatarWidth: 100,
	classNameBindings: ['additionalClasses'],
	isVisible: Em.computed.notEmpty('users'),
	label: null,
	limit: 5,
	thumbMode: Mercury.Modules.Thumbnailer.mode.fixedAspectRatio,
	trackingEvent: null,
	users: []
});
