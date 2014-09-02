/// <reference path="../app.ts" />
'use strict';

App.LightboxView = Em.View.extend({
	layoutName: 'lightbox',
	classNames: ['lightbox-wrapper'],
	classNameBindings: ['status'],
	attributeBindings: ['tabindex'],
	tabindex: 1,

	status: 'open',

	//this is needed if view wants to handle keyboard
	didInsertElement: function() {
		return this.$().focus();
	},

	keyDown: function(event){
		if (event.keyCode === 27) {
			this.get('controller').send('closeLightbox');
		}
	},

	willDestroyElement: function(){
		this.get('controller').setProperties({
			'lightboxFooterExpanded': false,
			'footerHidden': false,
			'headerHidden': false
		});
	}
});
