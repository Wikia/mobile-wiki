/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.InfoboxBuilderRoute = Em.Route.extend({
	renderTemplate(): void {
		this.render('infobox-builder');
    },



	model: function(params: any): Em.RSVP.Promise {
		this.set('templateName', params.templateName);

		return App.InfoboxBuilderModel.load(params.templateName);
	},

	afterModel: function(model: any): void {
		model.setInfoboxTemplateTitle(this.get('templateName'));
		model.setupInitialState();
		console.log(model);
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition): boolean {
			this.controllerFor('application').addAlert({
				message: i18n.t('app.infobox-builder-load-error'),
				type: 'alert'
			});
			M.track({
				action: M.trackActions.impression,
				category: 'infoboxBuilder',
				label: 'infobox-builder-load-error'
			});
			return true;
		},
		didTransition: function(): boolean {
			// InfoboxBuilderRoute works in "fullPage mode" (unlike ArticleRoute) which means that it takes
			// over whole page (so navigation, share feature, etc. are not displayed). To understand
			// better take a look at application.hbs.
			this.controllerFor('application').set('fullPage', true);
			window.scrollTo(0, 0);
			return true;
		}
	}
});
