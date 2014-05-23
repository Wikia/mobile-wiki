/// <reference path="../../definitions/ember/ember.d.ts" />
'use strict';

var Wikia: any = Em.Application.create({
	LOG_TRANSITIONS: true
});

i18n.init({}, function(i18n){
	Wikia.set('i18n', i18n);
});