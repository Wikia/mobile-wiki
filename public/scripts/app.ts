/// <reference path="../../definitions/ember/ember.d.ts" />
/// <reference path="../../definitions/i18next/i18next.d.ts" />
/// <reference path="utils/lazyload.ts" />
'use strict';

var App: any = Em.Application.create({
		LOG_ACTIVE_GENERATION: true,
		LOG_VIEW_LOOKUPS: true,
		LOG_TRANSITIONS: true
	}),
	currentLanguage: string = 'en';

