/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderItemTitleComponent = Em.Component.extend(App.InfoboxBuilderItemMixin, {
	tagName: '',
	value: Em.computed.oneWay('item.data.defaultValue')
});
