/// <reference path="../app.ts" />

'use strict';

App.ArticleCommentsView = Em.View.extend({
	scrollToTop: function () {
		window.scrollTo(0, this.$('.comments').offset().top);
	},

	scrollToBottom: function () {
		window.scrollTo(0, this.$('.comments').offset().top + this.$('.comments').height());
	}
});
