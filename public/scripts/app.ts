/// <reference path="../../typings/ember/ember.d.ts" />
/// <reference path="../../typings/i18next/i18next.d.ts" />

'use strict';

declare var i18n;
declare var _T;

var App: any = Em.Application.create({
	LOG_ACTIVE_GENERATION: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_TRANSITIONS: true,
	language: 'en'
});

App.initializer({
	name: 'preload',
	initialize: (container: any, application: any) => {
		i18n.init({
			lng: 'en',
			debug: 'true',
			resStore: _T
		});
	}
});
