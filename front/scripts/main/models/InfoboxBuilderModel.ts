/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
'use strict';

interface DataItem {
	data: {
		defaultValue: string;
		label: string;
	};
	infoboxBuilderData: {
		index: number;
		position: number;
		component: string;
	};
	source: string;
	type: string;
}

interface ImageItem {
	data: {
		alt: {
			source: string;
			data: {
				defaultValue: string;
			}
		};
		caption: {
			source: string;
			data: {
				defaultValue: string;
			}
		};
		defaultValue: string;
	};
	infoboxBuilderData: {
		index: number;
		position: number;
		component: string;
	};
	source: string;
	type: string;
}

interface TitleItem {
	data: {
		defaultValue: string;

	};
	infoboxBuilderData: {
		index: number;
		position: number;
		component: string;
	};
	source: string;
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
		var itemType = 'data',
			i = this.increaseItemIndex('data');

		this.addToState({
			data: {
				defaultValue: `${i18n.t('app.infobox-builder-data-item-default-value')} ${i}`,
				label: `${i18n.t('app.infobox-builder-label-item-default-value')} ${i}`,
			},
			infoboxBuilderData: {
				index: i,
				position: this.get('_stateLength'),
				component: this.createComponentName(itemType)
			},
			source: `data${i}`,
			type: 'infobox-data-item'
		});
	},

	/**
	 * add <image> item
	 */
	addImageItem() : void {
		var itemType = 'image',
			i = this.increaseItemIndex(itemType);

		this.addToState({
			data: {
				alt: {
					source: `alt${i}`,
					defaultValue: i18n.t('app.infobox-builder-alt-item-default-value'),
				},
				caption: {
					source: `caption${i}`,
					defaultValue: i18n.t('app.infobox-builder-caption-item-default-value'),
				} ,
				defaultValue: 'path/to/image.jpg',
			},
			infoboxBuilderData: {
				index: i,
				position: this.get('_stateLength'),
				component: this.createComponentName(itemType)
			},
			source: `image${i}`,
			type: 'infobox-image-item'
		});
	},

	/**
	 * add <title> item
	 */
	addTitleItem() : void {
		var itemType = 'title',
			i = this.increaseItemIndex('title');

		this.addToState({
			data: {
				defaultValue: `${i18n.t('app.infobox-builder-title-item-default-value')} ${i}`,

			},
			infoboxBuilderData: {
				index: i,
				position: this.get('_stateLength'),
				component: this.createComponentName(itemType)
			},
			source: `title${i}`,
			type: 'infobox-title-item'
		});
	},

	/**
	 * creates component name for given item type
	 * @param {String} type
	 * @returns {String}
	 */
	createComponentName(type: string): string {
		return `infobox-builder-item-${type}`;
	},

	/**
	 * cleans up infobox state and returns simple array
	 * @param {Em.A} state
	 * @returns {Array}
	 */
	prepareStateForSaving(state: Ember.Array): Object[] {
		return state.map((item: DataItem|ImageItem|TitleItem) => {
			delete item.infoboxBuilderData;
			return item;
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
					method: 'publish',
					infoboxData: this.prepareStateForSaving(this.get('infoboxState'))
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
