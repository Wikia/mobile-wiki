/// <reference path="../app.ts" />
'use strict';

/**
 * Window
 * @typedef {object} Window
 * @property {any} Ponto
 */
interface Window {
	Ponto: any
}

App.IEIFrameFocusFixMixin = Em.Mixin.create({
	/**
	 * Internet Explorer 11 has problems with catching focus
	 * when user clicks on an input which is rendered inside an iframe.
	 * This mixin triggers function in mediawiki app
	 * which sets focus on iframe after component with this mixin is inserted.
	 * Function is triggered only when Mercury is loaded inside an iframe - Ponto is defined
	 *
	 * @returns {void}
	 */
	didInsertElement(): void {
		var ponto = window.Ponto;
		if (ponto && typeof ponto.invoke === 'function') {
			ponto.invoke(
				'curatedContentTool.pontoBridge',
				'setFocus',
				{},
				Em.K,
				(err: any): void => {
					Em.Logger.error('Ponto error:', err);

					this.controllerFor('application').addAlert({
						message: i18n.t('app.curated-content-error-other'),
						type: 'alert'
					});
				},
				true
			);
		}
	},
});
