/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../mixins/FullPageMixin.ts"/>

'use strict';

App.ArticleEditRoute = Em.Route.extend(App.FullPageMixin, {
	/**
	 * @param {*} params
	 * @returns {Em.RSVP.Promise}
	 */
	model: function(params: any): Em.RSVP.Promise {
		return App.ArticleEditModel.load(params.title, params.sectionIndex);
	},

	/**
	 * @returns {undefined}
	 */
	renderTemplate(): void {
		this.render('article-edit', {
			controller: 'articleEdit'
		});
	},

	actions: {
		/**
		 * @param {*} error
		 * @param {EmberStates.Transition} transition
		 * @returns {boolean}
		 */
		error(error: any, transition: EmberStates.Transition): boolean {
			this.controllerFor('application').addAlert({
				message: i18n.t('app.edit-load-error'),
				type: 'alert'
			});
			M.track({
				action: M.trackActions.impression,
				category: 'sectioneditor',
				label: 'edit-load-error'
			});
			return true;
		}
	}
});
