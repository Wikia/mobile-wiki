/// <reference path="../app.ts" />
'use strict';

App.MediaModel = Ember.ArrayController.extend({
	//media: Wikia.article.article.media,
	init: function(){
		this.set('media', Wikia.article.article.media)
	},
	image: function(mediaRef = 0){
		console.log(this.get('media'))
		return this.get('media')[mediaRef];
	}.property('media')
});
