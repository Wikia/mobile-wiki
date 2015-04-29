/// <reference path="../app.ts" />

'use strict';

App.CuratedContentSectionModel = Em.Object.extend({
	sectionItems: [],

	fetchItemsForSection: function(sectionName: string) : any {
		if (!this.sectionItems.length) {
			return new Em.RSVP.Promise((resolve:Function, reject:Function) => {
				Em.$.ajax({
					url: App.get('apiBase') + '/curatedContent/' + sectionName,
					success: (data) => {
						this.set('sectionItems', data.items);
						resolve(this);
					},
					error: (data) => {
						reject(data);
					}
				});
			});
		}
	}
});
