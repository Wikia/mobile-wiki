/// <reference path="../app.ts" />

'use strict';

App.ArticleCommentsRoute = Em.Route.extend({
	model: function () {
		return App.ArticleCommentsModel.find({
			id: this.modelFor('article').get('id')
		});
	},
	setupController: function (controller, model) {
		controller.set('content', model.get('comments'));
		this.controllerFor('articleUsers').set('content', model.get('users'));
	},
	renderTemplate: function () {
		this.render('article/comments', {
			outlet: 'comments'
		});
	},
	actions: {
		error (err) {
			console.warn(err);
			return true;
		},
		loading () {
			return true;
		}
	}
});
