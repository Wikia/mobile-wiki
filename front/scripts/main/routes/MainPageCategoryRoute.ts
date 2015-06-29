/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageCategoryRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		var items = App.CuratedContentModel.fetchItemsForSection(params.categoryName, 'category');
		items.catch(() => {
			this.controllerFor('application').addAlert('info', i18n.t('app.category-not-exist'));
			this.transitionTo('mainPage');
		});
		return items;
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
		});
	}
});
