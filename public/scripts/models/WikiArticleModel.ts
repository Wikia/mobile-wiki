/// <reference path="../app.ts" />
Wikia.WikiArticleModel = Ember.Object.extend({
	headings: function (): any[] {
		return this.get('headers').toArray();
	}.property('headers')
});
