/// <reference path="../app.ts" />

'use strict';

App.CuratedContentModel = Em.Object.extend({
	activeSectionItems: [],
	cachedSectionItems: {},
	showItems: false,

	fetchItemsForSection: function(sectionName: string) : any {
		if (!this.cachedSectionItems[sectionName]) {
			return new Em.RSVP.Promise((resolve:Function, reject:Function) => {
				Em.$.ajax({
					url: App.get('apiBase') + '/curatedContent/' + sectionName,
					success: (data) => {
						this.set('activeSectionItems', data.items);
						this.cachedSectionItems[sectionName] = data.items;
						this.set('showItems', true);
						resolve(this);
					},
					error: (data) => {
						reject(data);
					}
				});
			});
		} else {
			this.set('activeSectionItems', this.cachedSectionItems[sectionName])
			this.set('showItems', true);
		}
	},

	hideItems: function(): void {
		this.set('showItems', false);
	}
});
