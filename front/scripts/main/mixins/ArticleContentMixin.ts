'use strict';

/**
 * This mixin keeps track of current article-content width which is updated on every window resize.
 * ArticleContentMixin should be included in all places
 * where article-content width is accessed or resize event should be bound.
 * Mixin has only one property: articleContent.
 * It is stored as object because objects and arrays are shared among all objects which include mixin.
 * @type {Ember.Mixin}
 */
App.ArticleContentMixin = Em.Mixin.create({
	//This object is shared among all objects which include this mixin
	articleContent: {
		width: null
	},

	onInit: function (): void {
		App.ArticleContentListeners.add(this);
	}.on('init'),

	onWillDestroyElement: function (): void {
		App.ArticleContentListeners.remove(this);
	}.on('willDestroyElement')
});

/**
 * This object keeps track of all components which include ArticleContentMixin.
 * It needed to be created because components can appear and disappear from the page (for example lightbox).
 * In such case mixin alone can't keep track of all objects which include it and is some cases context might be lost.
 * With ArticleContentListeners object we are binding to resize event only once and we update the articleContent.width value in mixin only once.
 * @type {Ember.Object}
 */
App.ArticleContentListeners = Em.Object.create({
	initialized: false,
	containers: [],
	articleContentSelector: '.article-content',
	articleContentWidth: null,

	add: function (container: Em.Component): void {
		this.containers.push(container);
		if (!this.initialized) {
			Em.$(window).on('resize', () => {
				this.onResize
			});
			this.articleContentWidth = $(this.articleContentSelector).width();
			container.set('articleContent.width', this.articleContentWidth);
			this.initialized = true;
		}
	},

	remove: function (container: Em.Component): void {
		var index = this.containers.indexOf(container);

		if (index > -1) {
			this.containers.splice(index, 1);
		}
	},

	onResize: function (): void {
		var containers = this.containers,
			containersCount = containers.length;

		//We set current width on articleContentWidth so we always keep track of article-content width.
		//Even if components are no longer registered (for example in case of opening/closing infobox).
		this.articleContentWidth = $(this.articleContentSelector).width();

		//If some containers are registered it is enough to update value in one of them
		//because articleContent.width property is shared among all objects which include ArticleContentMixin
		if (containersCount > 0) {
			containers[0].set('articleContent.width', this.articleContentWidth);
		}
	}
});
