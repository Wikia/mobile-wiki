/// <reference path="../app.ts" />
'use strict';

App.LightboxView = Em.View.extend({
	classNames: ['lightbox-wrapper'],
	classNameBindings: ['status', 'hiddenFooter', 'hiddenHeader'],

	footerExpanded: false,
	hiddenFooter: false,
	hiddenHeader: false,
	status: 'open',

	click: function(){
		this.toggleProperty('hiddenFooter');
		this.toggleProperty('hiddenHeader');
	},

	actions: {
		toggleFooter: function(){
			this.toggleProperty('footerExpanded');
		}
	}
});

