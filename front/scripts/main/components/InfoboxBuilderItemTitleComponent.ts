/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderItemTitleComponent = Em.Component.extend({
	tagName: '',
	attributeBindings: ['data-position'],
	position: Em.computed('infoboxBuilderData', function(){
		return this.get('infoboxBuilderData.position');
	}),
	value: Em.computed('data', function(){
		return this.get('data.defaultValue');
	})
});
