/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorModel = Em.Object.extend({
	featured: null,
	curated: null,
	optional: null,

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
			rawData.forEach(function (section: CuratedContentEditorItemInterface) {
				if (section.featured === 'true') {
					featured = section;
				} else if (section.title === '') {
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
			if (sections[i].title === section) {
				sections[i].items.push(newItem);
			}
		}

		return currentModel;
	},

	updateBlockItem: function (
		currentModel: typeof App.CuratedContentEditorModel,
		newItem: CuratedContentEditorItemInterface,
		blockName: string,
		oldItem: any
	): typeof App.CuratedContentEditorModel {
		var blockItems = currentModel[blockName].items;

		for (var i=0; i<blockItems.length; i++) {
			if (
				(blockName === 'curated' && blockItems[i].title === oldItem.title)
				|| (blockName !== 'curated' && blockItems[i].label === oldItem.label)
			) {
				blockItems[i] = newItem;
			}
		}

		return currentModel;
	},

	updateSectionItem: function (
		currentModel: typeof App.CuratedContentEditorModel,
		newItem: CuratedContentEditorItemInterface,
		sectionName: string,
		oldItem: any
	): typeof App.CuratedContentEditorModel {
		var sections = currentModel.curated.items,
			sectionWithItemItems: string, i: number;

		for (i = 0; i < sections.length; i++) {
			if (sections[i].title === sectionName) {
				sectionWithItemItems = sections[i].items;
				break;
			}
		}

		for (i = 0; i < sectionWithItemItems.length; i++) {
			if (sectionWithItemItems[i].label === oldItem.label) {
				sectionWithItemItems[i] = newItem;
				break;
			}
		}

		return currentModel;
	},


	getBlockItem: function(
		model: typeof App.CuratedContentEditorModel, blockName: string, itemIdentifier: string
	): CuratedContentEditorItemInterface {
		var blockItems = model[blockName].items,
			item: CuratedContentEditorItemInterface = null;

		blockItems.some(function(itemObj: CuratedContentEditorItemInterface) {
			if ((blockName === 'curated' && itemObj.title === itemIdentifier) || itemObj.label === itemIdentifier) {
				item = $.extend({}, itemObj);
				return true;
			}
		});

		return item;
	},

	getSectionItem: function(model: typeof App.CuratedContentEditorModel, sectionName: string, itemLabel: string): CuratedContentEditorItemInterface {
		var sections = model.curated.items,
			item: CuratedContentEditorItemInterface = null;

		sections.some(function(sectionObj: CuratedContentEditorItemInterface) {
			if (sectionObj.title === sectionName) {
				sectionObj.items.some(function(itemObj: CuratedContentEditorItemInterface) {
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


});
