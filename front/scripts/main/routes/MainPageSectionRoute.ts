/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.MainPageSectionRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.fetchItemsForSection(params.sectionName, 'section');
	},

	serialize: function (model: any) {
		return {
			sectionName: model.get('label')
		};
	},

	renderTemplate: function() {
		this.render('mainPageSection', {into: 'application'});
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
