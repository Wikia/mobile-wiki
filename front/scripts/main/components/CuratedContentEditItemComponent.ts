/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditItemComponent = Em.Component.extend({
	classNames: ['curated-content-edit-item'],

	/**
	 * Sections have titles, section items have labels and titles - we want to show labels for them
	 */
	title: Em.computed('model', function (): string {
		var model = this.get('model');

		return model.label || model.title;
	})
});
