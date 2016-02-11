import Ember from 'ember';

export default Ember.Component.extend({
	editPanelOption: Ember.computed('item.type', function () {
		return `infobox-builder-edit-item-${this.get('item.type')}`;
	}),

	actions: {
		removeItem() {
			this.get('onDeleteItem')(this.get('item'));
		},
		back() {
			this.get('onBackArrowClick')();
		}
	}
});
