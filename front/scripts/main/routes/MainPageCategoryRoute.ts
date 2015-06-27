/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageCategoryRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		console.log(params);
		return App.CuratedContentModel.fetchItemsForSection(params.categoryName, 'category');
	},

	renderTemplate: function() {
		this.render('mainPageCategory', {into: 'application'});
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition): boolean {
			this.controllerFor('application').addAlert('alert', i18n.t('app.edit-load-error'));
			M.track({
				action: M.trackActions.impression,
				category: 'sectioneditor',
				label: 'edit-load-error'
			});
			return true;
		}
	}
});
