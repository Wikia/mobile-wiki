/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />

'use strict';

App.ArticleEditComponent = Em.Component.extend(
	App.ViewportMixin,
	{
		classNames: ['article-edit'],

		viewportHeightObserver: Em.observer('viewportDimensions.height', function () {
			this.adjustTextareaHeight();
		}),

		adjustTextareaHeight: Em.on('didInsertElement', function(): void {
			Em.$('textarea').css('height', Em.$(window).height() - Em.$('.edit-head').outerHeight());
		}),

		actions: {
			/**
			 * @returns {void}
			 */
			back(): void {
				this.sendAction('back');
			},

			/**
			 * @returns {void}
			 */
			publish(): void {
				this.sendAction('publish');
			},
		},
	}
);
