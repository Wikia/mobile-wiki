/// <reference path="../app.ts" />
'use strict';
App.LoadReplyBtnView = Em.View.extend({
	tagName: 'a',
	click: function () {
		this.get('controller').send('toggleExpand');
	}
});

