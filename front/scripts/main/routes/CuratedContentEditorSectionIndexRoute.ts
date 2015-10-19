/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionIndexRoute = Em.Route.extend({
	/**
	 * @returns {void}
	 */
	renderTemplate(): void {
		this.render('curated-content-editor-section', {
			controller: 'curatedContentEditor.section'
		});
	}
});
