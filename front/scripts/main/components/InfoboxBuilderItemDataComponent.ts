/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderItemDataComponent = Em.Component.extend({
	tagName: '',
	attributeBindings: ['data-position'],
	label: Em.computed('data', function(){
		return this.get('data.label');
	}),
	value: Em.computed('data', function(){
		return this.get('data.defaultValue');
	}),
	position: Em.computed('infoboxBuilderData', function(){
		return this.get('infoboxBuilderData.position');
	}),
});
