/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageCategoryRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.fetchItemsForSection(params.categoryName, 'category');
	},

	afterModel: function (model: any, transition: EmberStates.Transition): void {
		var categoryName = transition.params['mainPage.category'].categoryName;

		document.title = categoryName + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');

		this.controllerFor('mainPage').setProperties({
			isRoot: false,
			title: categoryName
		});
	},

	renderTemplate: function (controller: any, model: CuratedContentItem[]) {
		this.render('mainPage', {
			into: 'application',
			model: {
				mainPageData: {
					curatedContent: model
				}
			}
		})
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition): void {
			this.controllerFor('application').addAlert('warning', i18n.t('app.category-not-exist'));
			return this.transitionTo('mainPage');
		}
	}
});
