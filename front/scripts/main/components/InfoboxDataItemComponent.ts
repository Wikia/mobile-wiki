/// <reference path="../app.ts" />
'use strict';

App.InfoboxDataItemComponent = Em.Component.extend({
	tagName: '',
	value: Em.computed('data', function(){
		return this.get('data.defaultValue');
	}),
	label: Em.computed('data', function(){
		return this.get('data.label');
	})
});
