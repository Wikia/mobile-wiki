import App from '../app';

/**
 * This object keeps track of all components which include ArticleContentMixin.
 * It had to be created because components can appear and disappear from the page (for example lightbox).
 * In such case mixin alone can't keep track of all objects which include it and is some cases context might be lost.
 * With ArticleContentListeners object we are binding to resize event only once
 * and we update the articleContent.width value in mixin only once.
 * @type {Ember.Object}
 */

export default App.ArticleContentListeners = Ember.Object.create({
	initialized: false,
	containers: [],
	articleContentSelector: '.article-content',
	articleContent: {
		width: null
	},
	articleContentElement: null,

	/**
	 * This is a simple getter. It can't be a computed property because Ember.Object.create doesn't support them.
	 *
	 * @returns {JQuery}
	 */
	getArticleContentElement() {
		let articleContentElement = this.get('articleContentElement');

		if (articleContentElement !== null) {
			return articleContentElement;
		} else {
			articleContentElement = $(this.articleContentSelector);
			this.set('articleContentElement', articleContentElement);

			return articleContentElement;
		}
	},

	/**
	 * @param {Ember.Component} container
	 * @returns {void}
	 */
	add(container) {
		this.containers.push(container);

		if (!this.initialized) {
			Ember.$(window).on('resize', () => {
				this.onResize();
			});

			const articleContentWidth = this.getArticleContentElement().width();

			this.set('articleContent.width', articleContentWidth);
			container.set('articleContent.width', articleContentWidth);

			this.initialized = true;
		}
	},

	/**
	 * @param {Ember.Component} container
	 * @returns {void}
	 */
	remove(container) {
		const index = this.containers.indexOf(container);

		if (index > -1) {
			this.containers.splice(index, 1);
		}
	},

	/**
	 * @returns {void}
	 */
	onResize() {
		const containers = this.containers,
			containersCount = containers.length;

		// We set current width on this.articleContent.width so we always keep track of article-content width.
		// Even if components are no longer registered (for example in case of opening/closing infobox).
		this.set('articleContent.width', this.getArticleContentElement().width());

		// If some containers are registered it is enough to update value in one of them
		// because articleContent.width property is shared among all objects which include ArticleContentMixin
		if (containersCount > 0) {
			containers[0].set('articleContent.width', this.get('articleContent.width'));
		}
	}
});

/**
 * This mixin keeps track of current article-content width which is updated on every window resize.
 * ArticleContentMixin should be included in all places
 * where article-content width is accessed or resize event should be bound.
 * Mixin has only one property: articleContent.
 * It is stored as object because objects and arrays are shared among all objects which include mixin.
 * @type {Ember.Mixin}
 */
App.ArticleContentMixin = Ember.Mixin.create({
	// This object is shared among all objects which include this mixin
	articleContent: {
		width: null
	},

	/**
	 * @returns {void}
	 */
	init() {
		this._super();

		App.ArticleContentListeners.add(this);
	},

	/**
	 * @returns {void}
	 */
	willDestroyElement() {
		this._super();

		App.ArticleContentListeners.remove(this);
	}
});
