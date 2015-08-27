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

App.InfoboxBuilderModel = Em.Object.extend({
	itemIndex: {
		data: 0,
		image: 0,
		title: 0,
	},
	state: [],
	stateLength: Em.computed('state', {
		get(): number {
			return this.get('state').length;
		}
	}),
	title: null,

	/**
	 * add item to infobox state
	 * @param {DataItem|TitleItem|ImageItem} object
	 */
	addToState(object: DataItem|TitleItem|ImageItem): void {
		this.state.push(object);
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
				position: this.get('stateLength'),
				source: `data${i}`,
			},
			type: 'data'
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
				position: this.get('stateLength'),
				source: `image${i}`
			},
			type: 'image'
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
				position: this.get('stateLength'),
				source: `title${i}`,
			},
			type: 'title'
		});
	},

	/**
	 * increase index for given item type
	 * @param {String} intexType
	 * @returns {Number}
	 */
	increaseItemIndex(intexType: string): number {
		return ++this.itemIndex[intexType];
	},

	/**
	 * removes item from state for given position
	 * @param {Number} position
	 */
	removeItem(position: number): void {
		this.state.splice(position, 1);
	},

	/**
	 * setup infobox builder initial state
	 */
	setupInitialState(): void {
		this.addTitleItem();
		this.addImageItem();
		this.addDataItem();
	},
});
