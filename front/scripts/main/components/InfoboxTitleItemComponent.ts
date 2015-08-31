/// <reference path="../app.ts" />
'use strict';

App.InfoboxTitleItemComponent = Em.Component.extend({
	tagName: '',
	value: Em.computed('data', function(){
		return this.get('data.defaultValue');
	})
});
