/// <reference path="../app.ts" />
'use strict';

App.MainPageComponent = Em.Component.extend({
	classNames: ['main-page-modules'],
	featuredContentComponentVariation: Em.computed(function (): string {
		var optimizelyExperimentIds = {
				'experimentIdProd': '3079180094',
				'experimentIdDev': '3054131385'
			},
			optimizelyExperimentIdForThisEnvironment = Mercury.Utils.VariantTesting.getOptimizelyExperimentIdForThisEnvironment(optimizelyExperimentIds),
			optimizelyActiveExperimentsList = Mercury.Utils.VariantTesting.getOptimizelyActiveExperimentsList(),
			optimizelyVariationNumber: number;

		if (optimizelyActiveExperimentsList.indexOf(optimizelyExperimentIdForThisEnvironment) !== -1) {
			optimizelyVariationNumber = Mercury.Utils.VariantTesting.getOptimizelyExperimentVariationNumber(optimizelyExperimentIdForThisEnvironment);
		}

		switch (optimizelyVariationNumber) {
			case 0:
				return 'featured-content';
			case 1:
				return 'featured-content-variation-1';
			case 2:
				return 'featured-content-variation-2';
			case 3:
				return 'featured-content-variation-3';
			default:
				return 'featured-content';
		}
	}),

	didInsertElement: function(): void {
		M.track({
			action: M.trackActions.impression,
			category: 'modular-main-page',
			label: 'main-page-impression'
		});
	}
});
