/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderItemImageComponent = Em.Component.extend({
	tagName: '',
	url: '',
	thumbnail: 'http://images.fanpop.com/images/image_uploads/Kermit-the-Frog-the-muppets-121870_500_325.jpg',
	width: 270,
	height: 152,
	attributeBindings: ['data-position'],

	alt: Ember.computed.alias('data.alt.defaultValue'),

	caption: Ember.computed.alias('data.caption.defaultValue'),

	position: Ember.computed.alias('infoboxBuilderData.position'),

	videoClasses: Em.computed(function (): string {
		return this.get('isVideo') ? 'video video-thumbnail small' : ''
	})
});
