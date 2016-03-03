import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['image-review'],
	isModalVisible: false,

	isContextProvided: Ember.computed('thumbnailModel.context', function () {
		return this.get('thumbnailModel.context') !== '#';
	}),

	actions: {
		showModal(popupModel) {
			this.set('thumbnailModel', popupModel);
			this.set('isModalVisible', true);
		}
	}
});
