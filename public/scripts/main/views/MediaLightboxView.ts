/// <reference path="../app.ts" />
'use strict';

App.MediaLightboxView = App.LightboxView.extend({
	classNames: ['media-lightbox'],

	status: 'opening',

	keyDown: function(event: JQueryEventObject){
		if (event.keyCode === 39) {
			this.get('controller').incrementProperty('currentGalleryImage')
		} else if (event.keyCode === 37){
			this.get('controller').decrementProperty('currentGalleryImage')
		}

		this._super(event);
	},

	willDestroyElement: function(){
		this.get('controller').set('file', null);
		this._super();
	},

	didInsertElement: function() {
		setTimeout(() => {
			this.set('status', 'open');
		}, 100);

		this._super();
	}
});

