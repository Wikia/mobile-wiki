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

App.CuratedContentEditorModel = Em.Object.extend({
	featured: null,
	curated: null,
	optional: null
});

App.CuratedContentEditorModel.reopenClass({
	find: function (): Em.RSVP.Promise {
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
	 * @desc Accepts a raw object that comes from CuratedContent API and creates a model that we can use
	 *
	 * @param rawData
	 * @returns {any}
	 */
	sanitize: function (rawData: any): typeof App.CuratedContentEditorModel {
		var featured = {},
			curated = {
				items: <any>[]
			},
			optional = {};

		if (rawData.length) {
			rawData.forEach(function (section: CuratedContentEditorRawSectionInterface): void {
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

	addBlockItem: function (
		currentModel: typeof App.CuratedContentEditorModel,
		newItem: typeof App.CuratedContentEditorItemModel,
		block: string
	): void {
		currentModel[block].items.push(newItem);
	},

	addSectionItem: function (
		sectionModel: typeof App.CuratedContentEditorItemModel,
		newItem: typeof App.CuratedContentEditorItemModel
	): void {
		sectionModel.items.push(newItem);
	},

	updateBlockItem: function (
		currentModel: typeof App.CuratedContentEditorModel,
		newItem: typeof App.CuratedContentEditorItemModel,
		blockName: string,
		originalItemLabel: string
	): void {
		var blockItems = currentModel[blockName].items,
			i: number;

		for (i = 0; i < blockItems.length; i++) {
			if (blockItems[i].label === originalItemLabel) {
				blockItems[i] = newItem;
			}
		}
	},

	updateSectionItem(
		sectionModel: typeof App.CuratedContentEditorItemModel,
		newItem: typeof App.CuratedContentEditorItemModel,
		originalItemLabel: string
	): void {
		var items = sectionModel.items,
			i: number;

		for (i = 0; i < items.length; i++) {
			if (items[i].label === originalItemLabel) {
				items[i] = newItem;
				break;
			}
		}
	},

	updateSection: function (
		currentModel: typeof App.CuratedContentEditorModel,
		newSection: typeof App.CuratedContentEditorItemModel,
		originalLabel: any
	): void {
		var sections = currentModel.curated.items,
			i: number;

		for (i = 0; i < sections.length; i++) {
			if (sections[i].label === originalLabel) {
				sections[i] = newSection;
			}
		}
	},

	getBlockItem(
		model: typeof App.CuratedContentEditorModel,
		blockName: string,
		itemLabel: string
	): typeof App.CuratedContentEditorItemModel {
		var blockItems = model[blockName].items,
			item: typeof App.CuratedContentEditorItemModel = null;

		blockItems.some(function (itemObj: typeof App.CuratedContentEditorItemModel): boolean {
			if (itemObj.label === itemLabel) {
				item = App.CuratedContentEditorItemModel.createNew(itemObj);
				return true;
			}
		});

		return item;
	},

	getSectionItem(
		sectionModel: typeof App.CuratedContentEditorItemModel,
		itemLabel: string
	): typeof App.CuratedContentEditorItemModel {
		var items = sectionModel.items,
			item: typeof App.CuratedContentEditorItemModel = null;

		items.some(function (itemObj: typeof App.CuratedContentEditorItemModel): boolean {
			if (itemObj.label === itemLabel) {
				item = App.CuratedContentEditorItemModel.createNew(itemObj);
				return true;
			}
		});

		return item;
	},

	deleteBlockItem(
		model: typeof App.CuratedContentEditorModel,
		blockName: string,
		itemLabel: string
	): void {
		var blockItems = model[blockName].items,
			i: number;

		for (i = 0; i < blockItems.length; i++) {
			if (blockItems[i].label === itemLabel) {
				blockItems.splice(i, 1);
			}
		}
	},

	deleteSectionItem(
		sectionModel: typeof App.CuratedContentEditorModel,
		itemLabel: string
	): void {
		var items: typeof App.CuratedContentEditorItemModel[] = sectionModel.items,
			i: number;

		for (i = 0; i < items.length; i++) {
			if (items[i].label === itemLabel) {
				items.splice(i, 1);
				break;
			}
		}
	},

	deleteSection(
		model: typeof App.CuratedContentEditorModel,
		sectionLabel: string
	): void {
		var blockItems = model.curated.items,
			i: number;

		for (i = 0; i < blockItems.length; i++) {
			if (blockItems[i].label === sectionLabel) {
				blockItems.splice(i, 1);
			}
		}
	}
});
