/// <reference path="../app.ts" />
'use strict';

App.IEIFrameFocusFixMixin = Em.Mixin.create({
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
