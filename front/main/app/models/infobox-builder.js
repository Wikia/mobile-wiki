import Ember from 'ember';

const InfoboxBuilderModel = Ember.Object.extend({
	/**
	 * @returns {void}
	 */
	init() {
		this._super(...arguments);
		this._itemIndex = {
			row: 0,
			image: 0,
			title: 0
		};
		this.infoboxState = [];
		this.itemInEditMode = null;
	},

	/**
	 * @desc add already prepared item to current infobox state
	 * @param {Object} object
	 *
	 * @returns {Object} added item
	 */
	addToState(object) {
		this.get('infoboxState').pushObject(object);

		return object;
	},

	/**
	 * @desc add item to infobox state
	 * @param type string type of element we want to add
	 * @param elementData Object optional data if we already have some
	 *
	 * @returns {Object} added item
	 */
	addItem(type, elementData) {
		let item = {};

		switch (type) {
			case 'title':
				item = this.createTitleItem();
				break;
			case 'row':
				item = this.createRowItem();
				break;
			case 'image':
				item = this.createImageItem();
				break;
			default:
				break;
		}

		if (elementData) {
			item.data = elementData.data;
			item.source = elementData.source;
		}

		return this.addToState(item);
	},

	/**
	 * @returns {Object} added item
	 */
	createRowItem() {
		const itemType = 'row',
			index = this.increaseItemIndex(itemType);

		return {
			data: {
				label: i18n.t('main.label-default', {
					ns: 'infobox-builder',
					index
				})
			},
			infoboxBuilderData: {
				index,
				component: this.createComponentName(itemType)
			},
			source: `${itemType}${index}`,
			type: itemType
		};
	},

	/**
	 * @returns {Object} added item
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
				index,
				component: this.createComponentName(itemType)
			},
			source: `image${index}`,
			type: itemType
		};
	},

	/**
	 * @returns {Object} added item
	 */
	createTitleItem() {
		const itemType = 'title',
			index = this.increaseItemIndex('title');

		return {
			data: {
				defaultValue: ''
			},
			infoboxBuilderData: {
				index,
				component: this.createComponentName(itemType)
			},
			source: `${itemType}${index}`,
			type: itemType
		};
	},

	/**
	 * @desc creates component name for given item type
	 * @param {String} type
	 * @returns {String}
	 */
	createComponentName(type) {
		return `infobox-builder-item-${type}`;
	},

	/**
	 * @desc Prepares infobox state to be sent to API.
	 * The infoboxBuilderData part is needed only on
	 * client side so remove it and wrap result as data object of the main infobox tag
	 *
	 * @param {Em.Array} state
	 * @returns {String} stringified object
	 */
	prepareStateForSaving(state) {
		const plainState = state.map((item) => {
			delete item.infoboxBuilderData;
			return item;
		}).toArray();

		return JSON.stringify({data: plainState});
	},

	/**
	 * @desc increase index for given item type
	 * @param {String} indexType
	 * @returns {Number}
	 */
	increaseItemIndex(indexType) {
		return this.incrementProperty(`_itemIndex.${indexType}`);
	},

	/**
	 * @desc sets item to the edit mode
	 * @param {Object} item
	 * @returns {void}
	 */
	setEditItem(item) {
		this.set('itemInEditMode', item);
	},

	/**
	 * @desc sets a new value of the default field
	 * on the given title element
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
	 * @desc sets a new value of the label field
	 * on the given row (data) element
	 *
	 * @param {Object} item
	 * @param {string} value
	 * @returns {void}
	 */
	editRowItem(item, value) {
		const index = this.get('infoboxState').indexOf(item);

		this.set(`infoboxState.${index}.data.label`, value);

		if (value.trim().length) {
			this.set(`infoboxState.${index}.source`, InfoboxBuilderModel.sanitizeCustomRowSource(value));
		}
	},

	/**
	 * @desc removes item from state for given position
	 * @param {Object} item
	 * @returns {void}
	 */
	removeItem(item) {
		this.get('infoboxState').removeObject(item);
		this.resetEditMode();
	},

	/**
	 * @desc moves item in infoboxState by given offset
	 * @param {Number} offset
	 * @param {Object} item
	 * @returns {void}
	 */
	moveItem(offset, item) {
		const position = this.get('infoboxState').indexOf(item);

		if (this.isValidMove(position, offset)) {
			this.get('infoboxState').removeAt(position);
			this.get('infoboxState').insertAt(position + offset, item);
		}
	},

	/**
	 * @desc checks if move is valid based on item current position in the infoboxState and the move offset
	 * @param {Number} position
	 * @param {Number} offset
	 * @returns {Boolean}
	 */
	isValidMove(position, offset) {
		const lastItemIndex = this.get('infoboxState').length - 1,
			newPosition = position + offset;

		return position > 0 && offset < 0 && newPosition >= 0 ||
			position < lastItemIndex && offset > 0 && newPosition <= lastItemIndex;
	},

	/**
	 * @desc resets item in edit mode and its position to null
	 * @returns {void}
	 */
	resetEditMode() {
		this.set('itemInEditMode', null);
	},

	/**
	 * @desc setup infobox builder initial state
	 * @returns {void}
	 */
	setupInitialState() {
		this.addItem('title');
		this.addItem('image');
		this.addItem('row');
		this.addItem('row');
	},

	setupExistingState(state) {
		state.forEach((element) => {
			console.log('element!: ', element);
			this.addItem(element.type, element);
		});
	},

	/**
	 * @desc saves infobox state to MW template
	 * @returns {Ember.RSVP.Promise}
	 */
	saveStateToTemplate() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'PortableInfoboxBuilderController',
					method: 'publish',
					title: this.get('title'),
					data: this.prepareStateForSaving(this.get('infoboxState'))
				},
				dataType: 'json',
				method: 'POST',
				success: (data) => {
					if (data && data.success) {
						resolve(this.get('title'));
					} else {
						reject(data.errors);
					}
				},
				error: (err) => reject(err)
			});
		});
	}
});

InfoboxBuilderModel.reopenClass({
	/**
	 * @desc creates source for row item from user customized label value
	 * @param {String} input
	 * @returns {String}
	 */
	sanitizeCustomRowSource(input) {
		return input
			.trim()
			.toLowerCase()
			.replace(/\s+/g, '_');
	}
});

export default InfoboxBuilderModel;
