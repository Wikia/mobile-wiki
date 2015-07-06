/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageSectionRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.fetchItemsForSection(params.sectionName, 'section');
	},

	afterModel: function (model: any, transition: EmberStates.Transition): void {
		var sectionName = M.String.normalize(transition.params['mainPage.section'].sectionName),
			mainPageController = this.controllerFor('mainPage'),
			adsContext = $.extend({}, M.prop('mainPageData.adsContext'));

		document.title = sectionName + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');

		mainPageController.setProperties({
			isRoot: false,
			title: sectionName,
			adsContext: adsContext,
			ns: M.prop('mainPageData.ns')
		});
	},

	renderTemplate: function (controller: any, model: CuratedContentItem[]): void {
		this.render('main-page', {
			controller: 'mainPage',
			model: {
				mainPageData: {
					curatedContent: model
				}
			}
		})
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition): void {
			if ( error && error.status === 404 ) {
				this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-section-not-found'));
				return this.transitionTo('mainPage');
			}
		}
	}
});
