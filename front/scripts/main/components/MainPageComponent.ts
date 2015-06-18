/// <reference path="../app.ts" />
'use strict';

App.MainPageComponent = Em.Component.extend({
	classNames: ['main-page-modules'],
	featuredContentComponentVariation: Em.computed(function (): string {
		var experimentIds = {
				prod: '3079180094',
				dev: '3054131385'
			},
			variantTesting = Mercury.Utils.VariantTesting,
			experimentIdForThisEnv = variantTesting.getOptimizelyExperimentIdForThisEnvironment(experimentIds),
			activeExperimentsList = variantTesting.getOptimizelyActiveExperimentsList(),
			variationNumber: number;

		if (activeExperimentsList.indexOf(experimentIdForThisEnv) !== -1) {
			variationNumber = variantTesting.getOptimizelyExperimentVariationNumber(experimentIdForThisEnv);
		}

		switch (variationNumber) {
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
