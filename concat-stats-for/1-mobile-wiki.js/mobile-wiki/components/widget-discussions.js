define('mobile-wiki/components/widget-discussions', ['exports', 'ember-in-viewport', 'mobile-wiki/models/widget-discussions'], function (exports, _emberInViewport, _widgetDiscussions) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    getOwner = Ember.getOwner;
	exports.default = Component.extend(_emberInViewport.default, {
		classNames: ['widget-discussions'],
		layoutName: 'components/widget-discussions',
		isLoading: true,
		model: null,

		init: function init() {
			this._super.apply(this, arguments);

			this.set('model', _widgetDiscussions.default.create(getOwner(this).ownerInjection()));
		},


		/**
   * @returns {void}
   */
		didEnterViewport: function didEnterViewport() {
			var _this = this;

			this.get('model').find(this.getWithDefault('categoryIds', []), this.get('show'), this.get('itemCount')).then(function (posts) {
				_this.setProperties({
					posts: posts,
					isLoading: false
				});
			});
		},


		actions: {
			upvote: function upvote(post) {
				this.get('model').upvote(post);
			}
		}
	});
});