/// <reference path="../app.ts" />

'use strict';

App.CuratedContentModel = Em.Object.extend({
	activeSectionItems: [],
	cachedSectionItems: {},

	fetchItemsForSection: function(sectionName: string) : any {
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
			this.set('activeSectionItems', this.cachedSectionItems[sectionName])
		}
	}
});
