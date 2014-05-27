/// <reference path="../../definitions/ember/ember.d.ts" />
/// <reference path="utils/lazyload.ts" />
'use strict';

var App: any = Em.Application.create({
	LOG_ACTIVE_GENERATION: true,
	LOG_VIEW_LOOKUPS: true,
	LOG_TRANSITIONS: true
});

i18n.init({}, function(i18n){
	Wikia.set('i18n', i18n);
});
