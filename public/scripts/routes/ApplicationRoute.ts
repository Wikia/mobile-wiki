/// <reference path="../app.ts" />
'use strict';

App.ApplicationRoute = Em.Route.extend({
	model: function <T> (params: T): T {
		return params;
	},
	actions: {
		lang: function(lang) {
			App.getTranslation(lang).then(function(){
				Object.keys(App.Trans).forEach(function(key){
					App.Trans.notifyPropertyChange(key);
				});
			});
		}
	}
});