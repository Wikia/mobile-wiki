/// <reference path="../app.ts" />
'use strict';

Wikia.ApplicationController = Em.Controller.extend({
	name: 'Wikia R&D',
	actions: {
		updateLanguage: function (lang) {
			i18n.setLng(lang, function() {
				console.log('ready: ' + lang);
			});
		}
	}
});
