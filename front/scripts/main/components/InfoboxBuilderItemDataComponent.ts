/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderItemDataComponent = Em.Component.extend({
	tagName: '',
	attributeBindings: ['data-position'],

	label: Ember.computed.alias('data.label'),

	value: Ember.computed.alias('data.defaultValue'),

	position: Ember.computed.alias('infoboxBuilderData.position')
});
