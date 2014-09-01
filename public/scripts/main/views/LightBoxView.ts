/// <reference path="../app.ts" />
'use strict';

App.LightboxView = Em.View.extend({
	layoutName: 'lightbox',
	classNames: ['lightbox-wrapper'],
	classNameBindings: ['status', 'hiddenFooter', 'hiddenHeader'],
	attributeBindings: ['tabindex'],
	tabindex: '1',

	footerExpanded: false,
	hiddenFooter: false,
	hiddenHeader: false,
	status: 'open',

	//this is needed if view wants to handle keyboard
	didInsertElement: function() {
		return this.$().focus();
	},

	click: function(){
		this.toggleProperty('hiddenFooter');
		this.toggleProperty('hiddenHeader');
	},

	keyDown: function(event){
		if (event.keyCode === 27) {
			this.get('controller').send('closeLightbox');
		}
	},

	actions: {
		toggleFooter: function(){
			this.toggleProperty('footerExpanded');
		}
	}
});

