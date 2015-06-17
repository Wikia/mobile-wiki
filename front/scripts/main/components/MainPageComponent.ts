/// <reference path="../app.ts" />
'use strict';

App.MainPageComponent = Em.Component.extend({
	classNames: ['main-page-modules'],
	featuredContentComponentVariation: Em.computed(function (): string {
		var optimizelyExperimentIds = {
				'experimentIdProd': '3079180094',
				'experimentIdDev': '3054131385'
			},
			optimizelyExperimentId = Mercury.Utils.VariantTesting.getOptimizelyExperimentIdForEnvironment(optimizelyExperimentIds),
			optimizelyActiveExperimentsList = Mercury.Utils.VariantTesting.getOptimizelyActiveExperimentsList(),
			optimizelyVariationNumber: number;

		if (optimizelyActiveExperimentsList.indexOf(optimizelyExperimentId) !== -1) {
			optimizelyVariationNumber = Mercury.Utils.VariantTesting.getOptimizelyExperimentVariationNumber(optimizelyExperimentId);
		}

		switch (optimizelyVariationNumber) {
			case 0:
				console.log('original');
				break;
			case 1:
				console.log('one');
				break;
			case 2:
				console.log('two');
				break;
			case 3:
				console.log('three');
				break;
			default:
				console.log('default');
				break;
		}

		return 'featured-content';
	}),

	didInsertElement: function(): void {
		M.track({
			action: M.trackActions.impression,
			category: 'modular-main-page',
			label: 'main-page-impression'
		});
	}
});
