/// <reference path="../app.ts" />
'use strict';

App.MediaModel = Em.Object.extend({
	init: function (){
		this.set('media', Wikia.article.article.media)
	}
});
