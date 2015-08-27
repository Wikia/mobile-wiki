/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderComponent = Em.Component.extend({
	actions: {
		addDataTag(source: string, label: string): void {
			console.log("dodajesz data tag");
		},

		addGroup(): void {
			this.sendAction('addSection');
		},

		save(): void {
			this.trackClick('curated-content-editor', 'save');
			this.validateAndSave();
		}
	}
});
