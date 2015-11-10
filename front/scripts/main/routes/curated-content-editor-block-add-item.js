import Ember from 'ember';
import CuratedContentEditorModel from '../models/curated-content-editor';
import CuratedContentEditorItemModel from '../models/curated-content-editor-item';

const CuratedContentEditorBlockAddItemRoute = Ember.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} item
	 */
	model() {
		return CuratedContentEditorItemModel.createNew();
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberState.Transition} transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		const block = transition.params['curatedContentEditor.blockAddItem'].block,
			rootModel = this.modelFor('curatedContentEditor'),
			alreadyUsedLabels = (block === 'optional') ?
				CuratedContentEditorModel.getAlreadyUsedNonFeaturedItemsLabels(rootModel) :
				CuratedContentEditorModel.getAlreadyUsedLabels(rootModel.get(block));

		this._super(controller, model, transition);
		controller.setProperties({
			alreadyUsedLabels,
			block,
			isFeaturedItem: block === 'featured'
		});
	},

	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor-item');
	},

	actions: {
		/**
		 * @returns {void}
		 */
		goBack() {
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newItem
		 * @returns {void}
		 */
		done(newItem) {
			const block = this.controllerFor('curatedContentEditor.blockAddItem').get('block'),
				rootModel = this.modelFor('curatedContentEditor'),
				blockModel = rootModel[block];

			CuratedContentEditorModel.addItem(blockModel, newItem);
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @returns {void}
		 */
		deleteItem() {
			this.send('goBack');
		}
	}
});

export default CuratedContentEditorBlockAddItemRoute;
