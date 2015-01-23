'use strict';

App.ArticleContentMixin = Em.Mixin.create({

	//This object is shared among all objects which use this mixin
	articleContent: {
		_initiated: false,
		_eventHandler: null,
		width: null
	},

	updateArticleWidth: function (): void {
		this.set('articleContent.width', $('.article-content').width());
	},

	init: function (): void {
		this._super();
		if (!this.articleContent._initiated) {
			Em.$(window).on('resize', Em.run.bind(this, this.updateArticleWidth));
			this.articleContent._eventHandler = this.updateArticleWidth;
			this.articleContent._initiated = true;
		}
	},

	onDestroy: function() {
		Em.$(window).off('resize', this.articleContent.handler);
		this.set('articleContent._initiated', false);
	}.on('willDestroyElement')
});

