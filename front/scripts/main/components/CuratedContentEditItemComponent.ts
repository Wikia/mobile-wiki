/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditItemComponent = Em.Component.extend({
	classNames: ['curated-content-edit-item'],

	/**
	 * Sections have titles, section items have labels
	 */
	title: Em.computed('model', function (): string {
		var model = this.get('model');

		return model.title || model.label;
	})
});
