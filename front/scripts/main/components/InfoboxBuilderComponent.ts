/// <reference path="../app.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
'use strict';

App.InfoboxBuilderComponent = Em.Component.extend(App.TrackClickMixin, {
	actions: {
		addDataItem(source: string, label: string): void {
			console.log("dodajesz data tag");
			this.sendAction('addDataItem');
		},

		addGroup(): void {
			this.sendAction('addSection');
		},

		saveTemplate(): void {
			this.trackClick('infobox-builder', 'save');
			//this.validateAndSave();
			console.log("Saving template");
		},

		cancel(): void {
			this.trackClick('infobox-builder', 'cancel');
			//close iframe
		}
	}
});
