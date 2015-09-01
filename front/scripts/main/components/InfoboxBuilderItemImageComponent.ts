/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderItemImageComponent = Em.Component.extend({
	url: '',
	thumbnail: 'http://images.fanpop.com/images/image_uploads/Kermit-the-Frog-the-muppets-121870_500_325.jpg',
	width: 270,
	height: 152,
	tagName: '',
	alt: Em.computed('data', function() {
		return this.get('data.alt.defaultValue');
	}),
	caption: Em.computed('data', function() {
		return this.get('data.caption.defaultValue');
	}),
});
