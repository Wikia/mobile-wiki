/// <reference path="../app.ts" />
'use strict';

App.LightBoxView = Em.View.extend({
	classNames: ['light-box-wrapper'],
	classNameBindings: ['status', 'hiddenUI'],

	footerExpanded: false,
	hiddenUI: false,
	status: 'open',

	click: function(){
		this.toggleProperty('hiddenUI');
	},

	actions: {
		toggleFooter: function(){
			this.toggleProperty('footerExpanded');
		}
	}
});

