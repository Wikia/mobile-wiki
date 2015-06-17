/// <reference path="../app.ts" />
'use strict';

App.MainPageComponent = Em.Component.extend({
	classNames: ['main-page-modules'],
	featuredContentComponentVariation: Em.computed(function (): string {
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
