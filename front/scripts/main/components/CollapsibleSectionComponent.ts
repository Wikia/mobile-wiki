/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.CollapsibleSectionComponent = Em.Component.extend({
	classNames: ['collapsible-section'],
	isExpanded: false,
	classNameBindings: ['isExpanded'],

	actions: {
		toggleSection: function (): void {
			this.toggleProperty('isExpanded');
		}
	}
});
