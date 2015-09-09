/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderItemTitleComponent = Em.Component.extend({
	tagName: '',
	attributeBindings: ['data-position'],
	position: Em.computed.alias('infoboxBuilderData.position'),
	value: Em.computed.alias('data.defaultValue')
});
