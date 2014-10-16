/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.ArticleRoute = Em.Route.extend({
	queryParams: {
		file: {
			replace: true
		},
		commentsPage: {
			replace: true
		}
	},

	beforeModel: function (transition: EmberStates.Transition) {
		if (Wikia.error) {
			transition.abort();
		}

		this.transitionTo('article',
			Wikia.Utils.String.sanitize(transition.params.article.title)
		);
	},

	model: function (params: any) {
		return App.ArticleModel.find({
			title: Wikia.Utils.String.sanitize(params.title),
			wiki: this.controllerFor('application').get('domain')
		});
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition) {
			transition.abort();
			Em.Logger.warn(error);
			return true;
		},

		willTransition: function (transition: EmberStates.Transition) {
			// dismiss side nav when {{#link-to 'article'}} is called from side nav
			this.controllerFor('application').send('collapseSideNav');
			// notify a property change on soon to be stale model for observers (like
			// the Table of Contents menu) can reset appropriately
			this.notifyPropertyChange('cleanTitle');
		},
		// TODO: This currently will scroll to the top even when the app has encountered
		// an error. Optimally, it would remain in the same place.
		didTransition: function () {
			window.scrollTo(0, 0);
			// bubble up to application didTransition hook
			return true;
		},

		/**
		 * @desc Sets commentsPage property of ArticleController to 1
		 *
		 * The commentsPage property in ArticleController is being passed to ArticleCommentsComponent as page parameter.
		 * There is an observer on the page property in ArticleCommentsComponents on which the whole logic of loading
		 * comments and scrolling to their container depends.
		 */
		openComments: function (): viod {
			this.controllerFor('article').set('commentsPage', 1);
		}
	}
});
