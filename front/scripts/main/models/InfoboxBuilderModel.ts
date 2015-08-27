/// <reference path="../app.ts" />
'use strict';

interface InfoboxBuilderGetAssetsResponse {
	css: string[];
	templates: string[];
}

interface DataItem {
	index: number;
	defaultValue: string;
	label: string;
	position: number;
	source: string;
	type: string;
}

interface ImageItem {
	alt: string;
	caption: string;
	defaultAlt: string;
	defaultCaption: string;
	defaultValue: string;
	index: number;
	position: number;
	source: string;
	type: string;
}

interface TitleItem {
	index: number;
	defaultValue: string;
	position: number;
	source: string;
	type: string;
}

App.InfoboxBuilderModel = Em.Object.extend({
	itemIndex: {
		data: 0,
		image: 0,
		title: 0,
	},
	state: [],
	title: null,
});

App.InfoboxBuilderModel.reopenClass({
	stateLength: Em.computed('state', {
		get(): number {
			return this.get('state').length;
		}
	}),

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
			index: i,
			defaultValue: `${i18n.t('app.infobox-builder-data-item-default-value')} ${i}`,
			label: `${i18n.t('app.infobox-builder-label-item-default-value')} ${i}`,
			position: this.get('stateLength'),
			source: `data${i}`,
			type: 'data'
		});
	},

	/**
	 * add <image> item
	 */
	addImageItem() : void {
		var i = this.increaseItemIndex('image');

		this.addToState({
			alt: `alt${i}`,
			caption: `caption${i}`,
			defaultAlt: i18n.t('app.infobox-builder-alt-item-default-value'),
			defaultCaption: i18n.t('app.infobox-builder-caption-item-default-value'),
			defaultValue: 'path/to/image.jpg',
			index: i,
			position: this.get('stateLength'),
			source: `image${i}`,
			type: 'image'
		});
	},

	/**
	 * add <title> item
	 */
	addTitleItem() : void {
		var i = this.increaseItemIndex('title');

		this.addToState({
			index: i,
			defaultValue: `${i18n.t('app.infobox-builder-title-item-default-value')} ${i}`,
			position: this.get('stateLength'),
			source: `title${i}`,
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
	 * sets infobox template title
	 * @param {String} title
	 */
	setInfoboxTemplateTitle(title: string): void {
		this.set('title', title);
	},

	setupInitialState(): void {
		this.addTitleItem();
		this.addImageItem();
		this.addDataItem();
	},

	load(title: string): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax(<JQueryAjaxSettings>{
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'PortableInfoboxBuilderController',
					method: 'getAssets',
					format: 'json',
					title: title
				},
				success: (data: InfoboxBuilderGetAssetsResponse): void => {
					if (data) {
						resolve(App.InfoboxBuilderModel.init(data));
					} else {
						reject('Invalid data was returned from Infobox Builder API');
					}
				},
				error: (data: any): void => {
					reject(data);
				}
			});
		});
	},

	/**
	 * initualize Infobox Builder UI
	 * @param {InfoboxBuilderGetAssetsResponse} data
	 */
	init(data: InfoboxBuilderGetAssetsResponse): void {
		App.InfoboxBuilderModel.setupStyles(data.css);
		App.InfoboxBuilderModel.compileTemplates(data.templates);

		return App.InfoboxBuilderModel
			.create()
			.setupInitialState();

	},

	/**
	 * add oasis portable infobox styles to DOM
	 * @param {String[]} cssUrls
	 */
	setupStyles(cssUrls: string[]): void {
		var html = '';

		cssUrls.forEach(
			(url: string): void => {
				html += `<link type="text/css" rel="stylesheet" href="${url}">`
			}
		);

		$(html).appendTo('head');
	},

	/**
	 * compitle portable infobox item templates
	 * @param {String[]} templates
	 */
	compileTemplates(templates: string[]): void {
		var i: number, compiledTemplates: Function[] = [];

		for (i = 0; i < templates.length; i++) {
			compiledTemplates[i] = Em.Handlebars.compile(templates[i]);
		}
	}
});
