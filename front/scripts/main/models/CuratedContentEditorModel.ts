/// <reference path="../app.ts" />
'use strict';

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
			rawData.forEach(function (section: CuratedContentEditorItemInterface): void {
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
		newItem: CuratedContentEditorItemInterface,
		block: string
	): typeof App.CuratedContentEditorModel {
		currentModel[block].items.push(newItem);

		return currentModel;
	},

	addSectionItem: function (
		currentModel: typeof App.CuratedContentEditorModel,
		newItem: CuratedContentEditorItemInterface,
		section: string
	): typeof App.CuratedContentEditorModel {
		var sections: CuratedContentEditorItemInterface[] = currentModel.curated.items;

		for (var i = 0; i < sections.length; i++) {
			if (sections[i].label === section) {
				sections[i].items.push(newItem);
			}
		}

		return currentModel;
	},

	updateBlockItem: function (
		currentModel: typeof App.CuratedContentEditorModel,
		newItem: CuratedContentEditorItemInterface,
		blockName: string,
		originalItem: any
	): typeof App.CuratedContentEditorModel {
		var blockItems = currentModel[blockName].items,
			i: number;

		for (i = 0; i < blockItems.length; i++) {
			if (blockItems[i].label === originalItem.label) {
				blockItems[i] = newItem;
			}
		}

		return currentModel;
	},

	updateSectionItem(
		sectionModel: CuratedContentEditorItemInterface,
		newItem: CuratedContentEditorItemInterface,
		originalItem: any
	): void {
		var items = sectionModel.items,
			i: number;

		for (i = 0; i < items.length; i++) {
			if (items[i].label === originalItem.label) {
				items[i] = newItem;
				break;
			}
		}
	},

	getBlockItem(
		model: typeof App.CuratedContentEditorModel,
		blockName: string,
		itemLabel: string
	): CuratedContentEditorItemInterface {
		var blockItems = model[blockName].items,
			item: CuratedContentEditorItemInterface = null;

		blockItems.some(function (itemObj: CuratedContentEditorItemInterface): boolean {
			if (itemObj.label === itemLabel) {
				item = $.extend({}, itemObj);
				return true;
			}
		});

		return item;
	},

	getSectionItem(
		model: typeof App.CuratedContentEditorModel,
		sectionLabel: string,
		itemLabel: string
	): CuratedContentEditorItemInterface {
		var sections = model.curated.items,
			item: CuratedContentEditorItemInterface = null;

		sections.some(function (sectionObj: CuratedContentEditorItemInterface): boolean {
			if (sectionObj.label === sectionLabel) {
				sectionObj.items.some(function (itemObj: CuratedContentEditorItemInterface): boolean {
					if (itemObj.label == itemLabel) {
						item = $.extend({}, itemObj);
						return true;
					}
				});
				return true;
			}
		});

		return item;
	},

	deleteBlockItem(
		model: typeof App.CuratedContentEditorModel,
		blockName: string,
		itemToRemoval: CuratedContentEditorItemInterface
	): void {
		var blockItems = model[blockName].items,
			i: number;

		for (i = 0; i < blockItems.length; i++) {
			if (blockItems[i].label === itemToRemoval.label) {
				blockItems.splice(i, 1);
			}
		}
	},

	deleteSectionItem(
		sectionModel: typeof App.CuratedContentEditorModel,
		itemToRemoval: CuratedContentEditorItemInterface
	): typeof App.CuratedContentEditorModel {
		var items: CuratedContentEditorItemInterface[] = sectionModel.items,
			i: number;

		for (i = 0; i < items.length; i++) {
			if (items[i].label === itemToRemoval.label) {
				items.splice(i, 1);
				break;
			}
		}

		return sectionModel;
	},
});
