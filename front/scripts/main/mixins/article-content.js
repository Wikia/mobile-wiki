import Ember from 'ember';
import ArticleContentListeners from 'article-content-mixin.js';

/**
 * This mixin keeps track of current article-content width which is updated on every window resize.
 * ArticleContentMixin should be included in all places
 * where article-content width is accessed or resize event should be bound.
 * Mixin has only one property: articleContent.
 * It is stored as object because objects and arrays are shared among all objects which include mixin.
 * @type {Ember.Mixin}
 */
const ArticleContentMixin = Ember.Mixin.create({
	// This object is shared among all objects which include this mixin
	articleContent: {
		width: null
	},

	/**
	 * @returns {void}
	 */
	init() {
		this._super();

		ArticleContentListeners.add(this);
	},

	/**
	 * @returns {void}
	 */
	willDestroyElement() {
		this._super();

		ArticleContentListeners.remove(this);
	}
});

export default ArticleContentMixin;
