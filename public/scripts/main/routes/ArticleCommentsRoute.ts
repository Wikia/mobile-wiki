/// <reference path="../app.ts" />

'use strict';

App.ArticleCommentsRoute = Em.Route.extend({
	model: function () {
		return App.ArticleCommentsModel.find({
			id: this.modelFor('article').get('id')
		});
	},
	setupController: function (controller: Em.Controller, model: Em.Object) {
		controller.set('content', model.get('comments'));
		this.controllerFor('articleUsers').set('content', model.get('users'));
	},
	renderTemplate: function () {
		this.render('article/comments', {
			outlet: 'comments'
		});
	},
	actions: {
		error: function (err: any) {
			Em.Logger.warn(err);
			return true;
		},
		loading: function () {
			return true;
		}
	}
});
