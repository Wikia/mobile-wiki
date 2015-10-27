App.CuratedContentEditorBlockAddItemRoute = Em.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} item
	 */
	model() {
		return App.CuratedContentEditorItemModel.createNew();
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberState.Transition} transition
	 * @returns {undefined}
	 */
	setupController(controller, model, transition) {
		const block = transition.params['curatedContentEditor.blockAddItem'].block,
			rootModel = this.modelFor('curatedContentEditor'),
			alreadyUsedLabels = (block === 'optional') ?
				App.CuratedContentEditorModel.getAlreadyUsedNonFeaturedItemsLabels(rootModel) :
				App.CuratedContentEditorModel.getAlreadyUsedLabels(rootModel.get(block));

		this._super(controller, model, transition);
		controller.setProperties({
			alreadyUsedLabels,
			block,
			isFeaturedItem: block === 'featured'
		});
	},

	/**
	 * @returns {undefined}
	 */
	renderTemplate() {
		this.render('curated-content-editor-item');
	},

	actions: {
		/**
		 * @returns {undefined}
		 */
		goBack() {
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newItem
		 * @returns {undefined}
		 */
		done(newItem) {
			const block = this.controllerFor('curatedContentEditor.blockAddItem').get('block'),
				rootModel = this.modelFor('curatedContentEditor'),
				blockModel = rootModel[block];

			App.CuratedContentEditorModel.addItem(blockModel, newItem);
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @returns {undefined}
		 */
		deleteItem() {
			this.send('goBack');
		}
	}
});
