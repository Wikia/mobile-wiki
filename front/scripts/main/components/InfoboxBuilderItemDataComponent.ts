/// <reference path="../app.ts" />
/// <reference path="../mixins/InfoboxBuilderItemMixin.ts"/>

'use strict';

App.InfoboxBuilderItemDataComponent = Em.Component.extend(App.InfoboxBuilderItemMixin, {
	tagName: '',

	label: Ember.computed.oneWay('item.data.label'),
	value: Ember.computed.oneWay('item.data.defaultValue'),
});
