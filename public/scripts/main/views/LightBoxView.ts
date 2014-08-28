/// <reference path="../app.ts" />
'use strict';

App.LightBoxView = Em.View.extend({
	layoutName: 'view/light-box',

	classNames: ['light-box-wrapper'],
	classNameBindings: ['status'],

	status: 'open'
});

