import Ember from 'ember';

const InfoboxBuilderModel = Ember.Object.extend({
	_itemIndex: {
		data: 0,
		image: 0,
		title: 0
	},
	infoboxState: Ember.A([]),
	itemInEditMode: null,

	/**
	 * @desc add item to infobox state
	 * @param {DataItem|TitleItem|ImageItem} object
	 */
	addToState(object) {
		this.get('infoboxState').pushObject(object);
	},

	/**
	 * @desc add <data> item
	 * addItem's methods can be refactored when figure out
	 * stable version of infobox items and params
	 */
	addDataItem() {
		var itemType = 'data',
			i = this.increaseItemIndex('data');

		this.addToState({
			data: {
				defaultValue: `${i18n.t('infobox-builder:main.data-default')} ${i}`,
				label: `${i18n.t('infobox-builder:main.label-default')} ${i}`
			},
			infoboxBuilderData: {
				index: i,
				component: this.createComponentName(itemType)
			},
			source: `data${i}`,
			type: itemType
		});
	},

	/**
	 * @desc add <image> item
	 * addItem's methods can be refactored when figure out
	 * stable version of infobox items and params
	 */
	addImageItem() {
		var itemType = 'image',
			i = this.increaseItemIndex(itemType);

		this.addToState({
			data: {
				caption: {
					source: `caption${i}`
				}
			},
			infoboxBuilderData: {
				index: i,
				component: this.createComponentName(itemType)
			},
			source: `image${i}`,
			type: itemType
		});
	},

	/**
	 * @desc add <title> item
	 * addItem's methods can be refactored when figure out
	 * stable version of infobox items and params
	 */
	addTitleItem() {
		var itemType = 'title',
			i = this.increaseItemIndex('title');

		this.addToState({
			infoboxBuilderData: {
				index: i,
				component: this.createComponentName(itemType)
			},
			source: `title${i}`,
			type: itemType
		});
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
	 * @returns string stringified object
	 */
	prepareStateForSaving(state) {
		var plainState = state.map((item) => {
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
	 * @param {DataItem|ImageItem|TitleItem} item
	 */
	setEditItem(item) {
		this.set('itemInEditMode', item);
	},

	/**
	 * @desc removes item from state for given position
	 * @param {DataItem|ImageItem|TitleItem} item
	 */
	removeItem(item) {
		this.get('infoboxState').removeObject(item);
		this.resetEditMode();
	},

	/**
	 * @desc moves item in infoboxState by given offset
	 * @param {Number} offset
	 * @param {DataItem|ImageItem|TitleItem} item
	 */
	moveItem(offset, item) {
		var position = this.get('infoboxState').indexOf(item);

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
		var lastItemIndex = this.get('infoboxState').length -1,
			newPosition = position + offset;

		return position > 0 && offset < 0 && newPosition >= 0 ||
			position < lastItemIndex && offset > 0 && newPosition <= lastItemIndex;
	},

	/**
	 * @desc resets item in edit mode and its position to null
	 */
	resetEditMode() {
		this.set('itemInEditMode', null);
	},

	/**
	 * @desc setup infobox builder initial state
	 */
	setupInitialState() {
		this.addTitleItem();
		this.addImageItem();
		this.addDataItem();
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
				error: (err) => {
					reject(err);
				}
			});
		});
	}
});

export default InfoboxBuilderModel;
