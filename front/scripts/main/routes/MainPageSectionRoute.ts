/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageSectionRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		var items = App.CuratedContentModel.fetchItemsForSection(params.sectionName, 'section');
		items.catch(() => {
			this.controllerFor('application').addAlert('info', i18n.t('app.section-not-exist'));
			this.transitionTo('mainPage');
		});
		return items;
	},

	afterModel: function (model: any, transition: EmberStates.Transition): void {
		var sectionName = transition.params['mainPage.section'].sectionName;

		document.title = sectionName + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');

		this.controllerFor('mainPage').setProperties({
			isRoot: false,
			title: sectionName
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
