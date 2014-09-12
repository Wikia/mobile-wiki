/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.ArticleRoute = Em.Route.extend({
	queryParams: {
		file: {
			replace: true
		}
	},

	beforeModel: function (transition: EmberStates.Transition) {
		if (Wikia.error) {
			transition.abort();
		}
	},
	model: function (params: any) {
		return App.ArticleModel.find({
			title: params.title,
			wiki: this.controllerFor('application').get('domain')
		});
	},
	actions: {
		error: function (error: any, transition: EmberStates.Transition) {
			transition.abort();
			Em.Logger.warn(error);
		},
		// TODO: This currently will scroll to the top even when the app has encountered
		// an error. Optimally, it would remain in the same place.
		willTransition: function (transition: EmberStates.Transition) {
			if (transition.targetName === 'article.index') {
				window.scrollTo(0, 0);
			}

			// notify a property change on soon to be stale model for observers (like
			// the Table of Contents menu) can reset appropriately
			this.notifyPropertyChange('cleanTitle');
		},

		/**
		 * This is bubbled from ArticleView.ts only
		 * when comments were not rendered
		 * otherwise toggleComments from ArticleView.ts
		 * does not bubble the event
		 */
		toggleComments: function (): void {
			this.render('article/comments', {
				outlet: 'comments',
				into: 'article'
			});
		}
	}
});
