/// <reference path="../app.ts" />
'use strict';

interface CuratedContentEditorRawSectionInterface {
	label: string;
	image_id: number;
	node_type: string;
	items: CuratedContentEditorRawSectionInterface[]
	image_url?: string;
	featured?: string;
	type?: string;
}

interface CuratedContentValidationResponseInterface {
	status: boolean;
	error?: any;
}

type CuratedContentEditorModel = typeof App.CuratedContentEditorModel;

App.CuratedContentEditorModel = Em.Object.extend({
	featured: null,
	curated: null,
	optional: null
});

App.CuratedContentEditorModel.reopenClass({
	save(model: CuratedContentEditorModel): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php',
					query: {
						controller: 'CuratedContentController',
						method: 'setData'
					}
				}),
				dataType: 'json',
				method: 'POST',
				data: this.prepareDataForSave(model),
				success: (data: CuratedContentValidationResponseInterface): void => {
					resolve(data);
				},
				error: (data: any): void => {
					reject(data);
				}
			});
		});
	},

	load(): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'CuratedContent',
					method: 'getData',
					format: 'json'
				},
				success: (data: any): void => {
					if (Em.isArray(data.data)) {
						resolve(App.CuratedContentEditorModel.sanitize(data.data));
					} else {
						reject('Invalid data was returned from Curated Content API');
					}
				},
				error: (data: any): void => {
					reject(data);
				}
			});
		});
	},


	/**
	 * @desc Convert CuratedContentEditorModel to structure known by CuratedContent API
	 *
	 * @param model CuratedContentEditorModel
	 * @returns {Object}
	 */
	prepareDataForSave(model: CuratedContentEditorModel): any {
		return {
			data: [].concat(model.featured, model.curated.items, model.optional)
		};
	},

	/**
	 * @desc Accepts a raw object that comes from CuratedContent API and creates a model that we can use
	 *
	 * @param rawData
	 * @returns {Object}
	 */
	sanitize(rawData: any): CuratedContentEditorModel {
		var featured = {
				items: <any>[]
			},
			curated = {
				items: <any>[]
			},
			optional = {
				items: <any>[]
			};

		if (rawData.length) {
			rawData.forEach((section: CuratedContentEditorRawSectionInterface): void => {
				if (section.featured === 'true') {
					featured = section;
				} else if (section.label === '') {
					optional = section;
				} else {
					curated.items.push(section);
				}
			});
		}

		return App.CuratedContentEditorModel.create({
			featured: featured,
			curated: curated,
			optional: optional
		});
	},

	getItem(parent: CuratedContentEditorItemModel, itemLabel: string): CuratedContentEditorItemModel {
		var item: CuratedContentEditorItemModel = null;

		parent.items.some((itemObj: CuratedContentEditorItemModel): boolean => {
			if (itemObj.label === itemLabel) {
				item = App.CuratedContentEditorItemModel.createNew(itemObj);
				return true;
			}
		});

		return item;
	},

	getAlreadyUsedLabels(parentSection: CuratedContentEditorItemModel, childLabel: string = null): string[] {
		return parentSection.items.map((childItem: CuratedContentEditorItemModel): string => {
			return childItem.label !== childLabel ? childItem.label : null
		}).filter(String);
	},

	addItem(parent: CuratedContentEditorItemModel, newItem: CuratedContentEditorItemModel): void {
		parent.items.push(newItem.toJSON());
	},

	updateItem(parent: CuratedContentEditorItemModel, newItem: CuratedContentEditorItemModel, itemLabel: string): void {
		parent.items.forEach((
			item: CuratedContentEditorItemModel,
			index: number,
			parentItems: CuratedContentEditorItemModel[]
		): void => {
			if (item.label === itemLabel) {
				parentItems[index] = newItem.toJSON();
			}
		})
	},

	deleteItem(parent: CuratedContentEditorItemModel, itemLabel: string): void {
		parent.items = parent.items.filter((
				item: CuratedContentEditorItemModel
			): boolean => {
				return item.label !== itemLabel;
		});
	}
});
