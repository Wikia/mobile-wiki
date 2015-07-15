/// <reference path="../app.ts" />

'use strict';

App.CuratedContentEditSectionViewComponent = Em.Component.extend({
	didInsertElement: function (): void {
		console.log(this.get('model'))
	}
});
