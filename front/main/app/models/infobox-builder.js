import Ember from 'ember';
import getEditToken from '../utils/edit-token';

const InfoboxBuilderModel = Ember.Object.extend({
	/**
	 * @returns {void}
	 */
	init() {
		this._super(...arguments);
		this.setProperties({
			_itemIndex: {
				row: 0,
				image: 0,
				title: 0,
				'section-header': 0
			},
			infoboxState: [],
			itemInEditMode: null
		});
	},

	/**
	 * Adds already prepared item to the current infobox state
	 *
	 * @param {Object} object
	 * @returns {Object} added item
	 */
	addToState(object) {
		this.get('infoboxState').pushObject(object);

		return object;
	},

	/**
	 * Adds item to infobox state. Extend it with already existing data if present.
	 *
	 * @param {string} type type of element we want to add
	 * @param {Object} [elementData=null] optional data if we already have some
	 * @returns {Object} added item
	 */
	addItem(type, elementData = null) {
		let item = {};

		switch (type) {
			case 'title':
				item = InfoboxBuilderModel.extendTitleData(this.createTitleItem(), elementData);
				break;
			case 'row':
				item = InfoboxBuilderModel.extendRowData(this.createRowItem(), elementData);
				break;
			case 'image':
				item = InfoboxBuilderModel.extendRowData(this.createImageItem(), elementData);
				break;
			case 'section-header':
				item = InfoboxBuilderModel.extendHeaderData(this.createSectionHeaderItem(), elementData);
				break;
			default:
				Ember.Logger.warn(`Unsupported infobox builder type encountered: '${type}'`);
				break;
		}

		return this.addToState(item);
	},

	/**
	 * Creates new row item with accurate index with default data
	 *
	 * @returns {Object}
	 */
	createRowItem() {
		const itemType = 'row',
			index = this.increaseItemIndex(itemType);

		return {
			data: {
				label: i18n.t('main.label-default', {
					ns: 'infobox-builder'
				})
			},
			infoboxBuilderData: {
				id: itemType + index,
				index,
				component: InfoboxBuilderModel.createComponentName(itemType)
			},
			source: `${itemType}${index}`,
			type: itemType,
			sourceFrozen: false
		};
	},

	/**
	 * Creates new image item with accurate index with default data
	 *
	 * @returns {Object}
	 */
	createImageItem() {
		const itemType = 'image',
			index = this.increaseItemIndex(itemType);

		return {
			data: {
				caption: {
					source: `caption${index}`
				}
			},
			infoboxBuilderData: {
				id: itemType + index,
				index,
				component: InfoboxBuilderModel.createComponentName(itemType)
			},
			source: `image${index}`,
			type: itemType
		};
	},

	/**
	 * Create new title item with accurate index with default data
	 *
	 * @returns {Object}
	 */
	createTitleItem() {
		const itemType = 'title',
			index = this.increaseItemIndex(itemType);

		return {
			data: {
				defaultValue: ''
			},
			infoboxBuilderData: {
				id: itemType + index,
				index,
				component: InfoboxBuilderModel.createComponentName(itemType)
			},
			source: `${itemType}${index}`,
			type: itemType
		};
	},

	/**
	 * @returns {Object}
	 */
	createSectionHeaderItem() {
		const itemType = 'section-header',
			index = this.increaseItemIndex(itemType);

		return {
			data: i18n.t('main.section-header-default', {
				ns: 'infobox-builder'
			}),
			collapsible: false,
			infoboxBuilderData: {
				id: itemType + index,
				index,
				component: InfoboxBuilderModel.createComponentName(itemType)
			},
			type: itemType
		};
	},

	/**
	 * Increases index for given item type
	 *
	 * @param {String} indexType
	 * @returns {Number}
	 */
	increaseItemIndex(indexType) {
		return this.incrementProperty(`_itemIndex.${indexType}`);
	},

	/**
	 * Sets item to the edit mode and saves its current data in the moment of beginning editing
	 *
	 * @param {Object} item
	 * @returns {void}
	 */
	setEditItem(item) {
		if (item && !item.infoboxBuilderData.originalData) {
			const itemData = InfoboxBuilderModel.sanitizeItemData(item);

			// we need a copy of itemData, not a reference to it
			item.infoboxBuilderData.originalData = Ember.$.extend({}, itemData);
		}

		this.set('itemInEditMode', item);
	},

	/**
	 * Sets a new value of the default field on the given title element
	 *
	 * @param {Object} item
	 * @param {Boolean} value
	 * @returns {void}
	 */
	editTitleItem(item, value) {
		const index = this.get('infoboxState').indexOf(item),
			defaultValue = value ? '{{PAGENAME}}' : '';

		this.set(`infoboxState.${index}.data.defaultValue`, defaultValue);
	},

	/**
	 * Sets a new value of the label field on the given row (data) element
	 *
	 * @param {Object} item
	 * @param {string} value
	 * @returns {void}
	 */
	editRowItem(item, value) {
		const index = this.get('infoboxState').indexOf(item);

		this.set(`infoboxState.${index}.data.label`, value);

		if (!item.sourceFrozen) {
			const sanitizedSource = InfoboxBuilderModel.sanitizeCustomRowSource(value),
				// set itemType + index source, when empty value provided
				sourceValue = sanitizedSource.length ? sanitizedSource : `${item.type}${item.infoboxBuilderData.index}`;

			this.set(`infoboxState.${index}.source`, sourceValue);
		}
	},

	/**
	 * Sets a new value of the data field on the given section header element
	 *
	 * @param {Object} item
	 * @param {Object} newValues
	 * @returns {void}
	 */
	editSectionHeaderItem(item, newValues) {
		const index = this.get('infoboxState').indexOf(item);

		Object.keys(newValues).forEach(
			(key) => this.set(`infoboxState.${index}.${key}`, newValues[key])
		);
	},

	/**
	 * Removes item from state for given position
	 *
	 * @param {Object} item
	 * @returns {void}
	 */
	removeItem(item) {
		this.get('infoboxState').removeObject(item);
		this.setEditItem(null);
	},

	/**
	 * Updates infobox state order
	 *
	 * @param {Ember.Array} newState
	 * @returns {void}
	 */
	updateInfoboxStateOrder(newState) {
		this.set('infoboxState', newState);
	},

	/**
	 * Uses data from API to setup the model
	 *
	 * @param {Object} infoboxData
	 * @param {Boolean} isNew
	 * @returns {void}
	 */
	setupInfoboxData(infoboxData, isNew) {
		if (isNew) {
			this.setupInitialState();
		} else if (infoboxData.data) {
			this.setupExistingState(infoboxData.data);
		}
	},

	/**
	 * Setups infobox builder initial state
	 *
	 * @returns {void}
	 */
	setupInitialState() {
		this.editTitleItem(this.addItem('title'), true);
		this.addItem('image');
		this.addItem('row');
		this.addItem('row');
	},

	/**
	 * Setups infobox builder state from already existing infobox template
	 *
	 * @param {Array} state
	 * @returns {void}
	 */
	setupExistingState(state) {
		state.forEach((element) => this.addItem(element.type, element));
	},

	getTemplateExists(title) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.getJSON(
				M.buildUrl({
					path: '/wikia.php'
				}),
				{
					controller: 'PortableInfoboxBuilderController',
					method: 'getTemplateExists',
					title
				}
			).done((data) => {
				if (data && data.success) {
					resolve(data.exists);
				} else {
					reject(data);
				}
			});
		});
	},

	/**
	 * Saves infobox state to MW template
	 *
	 * @param {String} initialTitle of the template or null if new template
	 * @returns {Ember.RSVP.Promise}
	 */
	saveStateToTemplate(initialTitle) {
		const title = this.get('title');

		return new Ember.RSVP.Promise((resolve, reject) => {
			getEditToken(this.get('title'))
				.then((token) => {
					Ember.$.ajax({
						url: M.buildUrl({
							path: '/wikia.php'
						}),
						data: {
							controller: 'PortableInfoboxBuilderController',
							method: 'publish',
							title,
							oldTitle: initialTitle || title,
							data: InfoboxBuilderModel.prepareDataForSaving(this),
							token
						},
						dataType: 'json',
						method: 'POST',
						success: (data) => resolve(data),
						error: (err) => reject(err)
					});
				});
		});
	}
});

InfoboxBuilderModel.reopenClass({
	/**
	 * Creates source for row item from user customized label value
	 *
	 * @param {String} input
	 * @returns {String}
	 */
	sanitizeCustomRowSource(input) {
		const invalidChars = /[!|*}{*?%^&.+'\[\]]+/g,
			isEmpty = /^[-_]+$/,
			output = input
				.trim()
				.toLowerCase()
				.replace(/\s+/g, '_')
				.replace(invalidChars, '');

		return isEmpty.test(output) ? '' : output;
	},

	/**
	 * Creates component name for given item type
	 *
	 * @param {String} type
	 * @returns {String}
	 */
	createComponentName(type) {
		return `infobox-builder-item-${type}`;
	},

	/**
	 * Prepares infobox data to be sent to API.
	 * The infoboxBuilderData part is needed only on client side
	 * so remove it and wrap result as data object of the main infobox tag
	 *
	 * @param {Ember.Object} model
	 * @returns {String} stringified object
	 */
	prepareDataForSaving(model) {
		const plainState = InfoboxBuilderModel.getStateWithoutBuilderData(model.get('infoboxState')),
			dataToSave = {
				data: plainState
			};

		return JSON.stringify(dataToSave);
	},

	/**
	 * @param {Array} infoboxState
	 * @returns {Array}
	 */
	getStateWithoutBuilderData(infoboxState) {
		return infoboxState.map((item) => {
			delete item.infoboxBuilderData;
			return item;
		}).toArray();
	},

	/**
	 * Overrides some properties of given Row object with additional
	 * data, obtained from already existing template
	 * @todo: use Object.assign() when we switch to Babel6
	 * https://wikia-inc.atlassian.net/browse/DAT-3825
	 *
	 * @param {Object} item item to extend
	 * @param {Object} itemData additional data
	 * @returns {Object}
	 */
	extendRowData(item, itemData) {
		if (itemData) {
			const {data} = itemData,
			// as data can be devoid of label value
				{label} = data || {};

			item.source = itemData.source || '';
			item.data.label = label || '';
			item.sourceFrozen = true;
		}
		return item;
	},

	/**
	 * Overrides some properties of given Title object with additional
	 * data, obtained from already existing template
	 * @todo: use Object.assign() when we switch to Babel6
	 * https://wikia-inc.atlassian.net/browse/DAT-3825
	 *
	 * @param {Object} item item to extend
	 * @param {Object} itemData additional data
	 * @returns {Object}
	 */
	extendTitleData(item, itemData) {
		if (itemData) {
			const {data} = itemData,
			// as title can be devoid of default value
				{defaultValue} = data || {};

			item.source = itemData.source || '';
			item.data.defaultValue = defaultValue || '';
		}

		return item;
	},

	/**
	 * Overrides some properties of given Image object with additional
	 * data, obtained from already existing template
	 * @todo use Object.assign() when we switch to Babel6
	 * https://wikia-inc.atlassian.net/browse/DAT-3825
	 *
	 * @param {Object} item item to extend
	 * @param {Object} itemData additional data
	 * @returns {Object}
	 */
	extendImageData(item, itemData) {
		if (itemData) {
			item.source = itemData.source || '';
			item.data.caption.source = '';

			if (itemData.data && itemData.data.caption) {
				const {data: {caption: {source: captionSource}}} = itemData;

				item.data.caption.source = captionSource || '';
			}
		}

		return item;
	},

	/**
	 * Overrides some properties of given header object with additional
	 * data, obtained from already existing template
	 *
	 * @param {Object} item item to extend
	 * @param {Object} itemData additional data
	 * @returns {Object}
	 */
	extendHeaderData(item, itemData) {
		if (itemData) {
			item.data = itemData.data || '';
			item.collapsible = itemData.collapsible || false;
		}

		return item;
	},

	/**
	 * Unifies item data format
	 *
	 * @param {Object} item
	 * @returns {Object}
	 */
	sanitizeItemData(item) {
		let itemData = item.data;

		if (item.type === 'section-header') {
			itemData = {
				value: item.data,
				collapsible: item.collapsible
			};
		}

		return itemData;
	}
});

export default InfoboxBuilderModel;
