/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorModel = Em.Object.extend({
	featured: null,
	regular: null,
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
			regular = {
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
					regular.items.push(section);
				}
			});
		}

		return App.CuratedContentEditorModel.create({
			featured: featured,
			regular: regular,
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
		var sections: CuratedContentEditorItemInterface[] = currentModel.regular.items;

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
				(blockName === 'regular' && blockItems[i].title === oldItem.title)
				|| (blockName !== 'regular' && blockItems[i].label === oldItem.label)
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
		var sections = currentModel.regular.items;
		for (var i = 0; i < sections.length; i++) {
			if (sections[i].title === sectionName) {
				sections[i].items.indexOf(oldItem)
			}
		}

		return currentModel;
	},


	getBlockItem: function(model, blockName, item) {
		var blockItems = model[blockName].items,
			ret = {};
		blockItems.some(function(itemObj) {
			if ((blockName === 'regular' && itemObj.title === item) || itemObj.label === item) {
				ret = $.extend({}, itemObj);
				return true;
			}
		});

		return ret;
	},

	getSectionItem: function(model, sectionName, item) {

	},


});
