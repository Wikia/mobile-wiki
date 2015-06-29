/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageSectionRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.fetchItemsForSection(params.sectionName, 'section');
	},

	afterModel: function (model: any, transition: EmberStates.Transition): void {
		var sectionName = transition.params['mainPage.section'].sectionName,
			mainPageController = this.controllerFor('mainPage');

		document.title = sectionName + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');

		mainPageController.setProperties({
			isRoot: false,
			title: sectionName
		});

		// If user was previously on the main page this is already set
		if (!mainPageController.get('adsContext')) {
			mainPageController.set('adsContext', Em.get(Mercury, 'article.adsContext'));
		}
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
			this.controllerFor('application').addAlert('warning', i18n.t('app.section-not-exist'));
			return this.transitionTo('mainPage');
		}
	}
});
