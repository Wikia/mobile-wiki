/// <reference path="../app.ts" />
'use strict';
App.LoadReplyBtnView = Em.View.extend({
	tagName: 'a',
	click: function () {
		console.log('Before ' + this.get('parentView').get('repliesExpanded'));
		this.get('parentView').toggleProperty('repliesExpanded');
		console.log('After ' + this.get('parentView').get('repliesExpanded'));
		this.get('controller').send('toggleExpand');
	}
});

