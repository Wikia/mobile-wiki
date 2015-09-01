/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderItemTitleComponent = Em.Component.extend({
	tagName: '',
	value: Em.computed('data', function(){
		return this.get('data.defaultValue');
	})
});
