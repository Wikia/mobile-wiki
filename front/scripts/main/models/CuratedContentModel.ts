/// <reference path="../app.ts" />

'use strict';

App.CuratedContentModel = Em.Object.extend({
	activeSectionItems: [],
	cachedSectionItems: {},
	activeSection: false,

	fetchItemsForSection: function(sectionName: string) : any {
		this.set('activeSection', sectionName);
		if (!this.cachedSectionItems[sectionName]) {
			return new Em.RSVP.Promise((resolve:Function, reject:Function) => {
				Em.$.ajax({
					url: App.get('apiBase') + '/curatedContent/' + sectionName,
					success: (data) => {
						this.set('activeSectionItems', data.items);
						this.cachedSectionItems[sectionName] = data.items;
						resolve(this);
					},
					error: (data) => {
						reject(data);
					}
				});
			});
		} else {
			return new Em.RSVP.Promise((resolve:Function, reject:Function) => {
				this.set('activeSectionItems', this.cachedSectionItems[sectionName]);
				resolve(this);
			});
		}
	}
});
