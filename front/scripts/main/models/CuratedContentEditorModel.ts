/// <reference path="../app.ts" />
'use strict';

interface CuratedContentEditorRawSectionInterface {
	label: string;
	image_id: number;
	image_crop?: {
		landscape?: {
			x: number;
			y: number;
			width: number;
			height: number;
		};
		square?: {
			x: number;
			y: number;
			width: number;
			height: number;
		};
	};
	node_type: string;
	items: CuratedContentEditorRawSectionInterface[]
	image_url?: string;
	featured?: string;
	type?: string;
}

interface CuratedContentValidationResponseErrorInterface {
	target: string;
	type: string;
	reason: string;
}

interface CuratedContentValidationResponseInterface {
	status: boolean;
	error?: CuratedContentValidationResponseErrorInterface[];
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
			Em.$.ajax(<JQueryAjaxSettings>{
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
			Em.$.ajax(<JQueryAjaxSettings>{
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
		/**
		 * Label inside "optional" has to be initialized with empty string value.
		 * Code inside CuratedContentController:getSections (MW) decides based on this label
		 * if it's optional or not. If it's null it will fail rendering main page.
		 */
		var featured: any = {
				items: <any>[],
				featured: 'true',
			},
			curated: any = {
				items: <any>[]
			},
			optional: any = {
				items: <any>[],
				label: ''
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

	getAlreadyUsedLabels(sectionOrBlock: CuratedContentEditorItemModel, excludedLabel: string = null): string[] {
		return this.getLabels(sectionOrBlock, excludedLabel, {isLabelAlreadyExcluded: false}).filter(this.isString);
	},

	getAlreadyUsedNonFeaturedItemsLabels(block: CuratedContentEditorModel, excludedLabel: string = null): string[] {
		var labels: string[] = [],
			duplicationInfo = {isLabelAlreadyExcluded: false};

		// Labels of section items
		block.curated.items.forEach((section: CuratedContentEditorItemModel): void => {
			labels = labels.concat(
				this.getLabels(section, excludedLabel, duplicationInfo)
			);
		});

		// Labels of optional block items
		labels = labels.concat(this.getLabels(block.optional, excludedLabel, duplicationInfo));

		return labels;
	},

	getLabels(
		sectionOrBlock: CuratedContentEditorItemModel,
		excludedLabel: string = null,
		duplicationInfo: {isLabelAlreadyExcluded: boolean;} = {isLabelAlreadyExcluded: false}
	): string[] {
		var labels: string[] = [];

		if (Array.isArray(sectionOrBlock.items)) {
			labels = sectionOrBlock.items.map((sectionItem: CuratedContentEditorItemModel): string => {
				if (
					!this.isString(excludedLabel) ||
					duplicationInfo.isLabelAlreadyExcluded ||
					sectionItem.hasOwnProperty('label') &&
					this.isString(sectionItem.label) &&
					sectionItem.label.toLowerCase() !== excludedLabel.toLowerCase()
				) {
					return sectionItem.label.toLowerCase();
				} else {
					duplicationInfo.isLabelAlreadyExcluded = true;
					return null;
				}
			}).filter(this.isString);
		}

		return labels;
	},

	isString(item: any): boolean {
		return typeof item === 'string';
	},

	addItem(parent: CuratedContentEditorItemModel, newItem: CuratedContentEditorItemModel): void {
		//When parent doesn't have items we need to initialize them
		parent.items = parent.items || [];
		parent.items.push(newItem.toPlainObject());
	},

	updateItem(parent: CuratedContentEditorItemModel, newItem: CuratedContentEditorItemModel, itemLabel: string): void {
		parent.items.forEach((
			item: CuratedContentEditorItemModel,
			index: number,
			parentItems: CuratedContentEditorItemModel[]
		): void => {
			if (item.label === itemLabel) {
				parentItems[index] = newItem.toPlainObject();
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
