/// <reference path="../app.ts" />
'use strict';

interface DataItem {
	data: {
		index: number;
		defaultValue: string;
		label: string;
		position: number;
		source: string;
	};
	type: string;
}

interface ImageItem {
	data: {
		alt: string;
		caption: string;
		defaultAlt: string;
		defaultCaption: string;
		defaultValue: string;
		index: number;
		position: number;
		source: string;
	};
	type: string;
}

interface TitleItem {
	data: {
		index: number;
		defaultValue: string;
		position: number;
		source: string;
	};
	type: string;
}

interface SaveStateToTemplateResponse {
	success: boolean;
	errorMessage?: boolean;
}

App.InfoboxBuilderModel = Em.Object.extend({
	_itemIndex: {
		data: 0,
		image: 0,
		title: 0,
	},
	infoboxState: Ember.A([]),
	_stateLength: Em.computed('infoboxState', {
		get(): number {
			return this.get('infoboxState').length;
		}
	}),
	title: null,
	templates: {},

	/**
	 * add item to infobox state
	 * @param {DataItem|TitleItem|ImageItem} object
	 */
	addToState(object: DataItem|TitleItem|ImageItem): void {
		this.get('infoboxState').pushObject(object);
	},

	/**
	 * add <data> item
	 */
	addDataItem() : void {
		var i = this.increaseItemIndex('data');

		this.addToState({
			data: {
				index: i,
				defaultValue: `${i18n.t('app.infobox-builder-data-item-default-value')} ${i}`,
				label: `${i18n.t('app.infobox-builder-label-item-default-value')} ${i}`,
				position: this.get('_stateLength'),
				source: `data${i}`,
			},
			type: 'infobox-data-item'
		});
	},

	/**
	 * add <image> item
	 */
	addImageItem() : void {
		var i = this.increaseItemIndex('image');

		this.addToState({
			data: {alt: `alt${i}`,
				caption: `caption${i}`,
				defaultAlt: i18n.t('app.infobox-builder-alt-item-default-value'),
				defaultCaption: i18n.t('app.infobox-builder-caption-item-default-value'),
				defaultValue: 'path/to/image.jpg',
				index: i,
				position: this.get('_stateLength'),
				source: `image${i}`
			},
			type: 'infobox-image-item'
		});
	},

	/**
	 * add <title> item
	 */
	addTitleItem() : void {
		var i = this.increaseItemIndex('title');

		this.addToState({
			data: {
				index: i,
				defaultValue: `${i18n.t('app.infobox-builder-title-item-default-value')} ${i}`,
				position: this.get('_stateLength'),
				source: `title${i}`,
			},
			type: 'infobox-title-item'
		});
	},

	/**
	 * increase index for given item type
	 * @param {String} intexType
	 * @returns {Number}
	 */
	increaseItemIndex(intexType: string): number {
		return this.incrementProperty(`_itemIndex.${intexType}`);
	},

	/**
	 * removes item from state for given position
	 * @param {Number} position
	 */
	removeItem(position: number): void {
		this.get('infoboxState').removeAt(position);
	},

	/**
	 * setup infobox builder initial state
	 */
	setupInitialState(): void {
		this.addTitleItem();
		this.addImageItem();
		this.addDataItem();
	},

	/**
	 * saves infobox state to MW template
	 * @returns {Em.RSVP.Promise}
	 */
	saveStateToTemplate(): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax(<JQueryAjaxSettings>{
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'PortableInfoboxBuilderController',
					method: 'saveToTemplate',
					infoboxData: this.get('infoboxState')

				},
				dataType: 'json',
				success: (data: SaveStateToTemplateResponse): void => {
					if (data && data.success) {
						resolve(data);
					} else {
						reject(data.errorMessage);
					}
				},
				error: (data: any): void => {
					reject(data);
				}
			});
		});
	}
});
