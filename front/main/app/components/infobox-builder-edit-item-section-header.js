import Ember from 'ember';

export default Ember.Component.extend({
	value: Ember.computed('item.data', {
		get() {
			return this.get('item.data');
		},
		set(key, value) {
			this.get('editSectionHeaderItem')(this.get('item'), value);
			return value;
		}
	}),

	init() {
		this._super(...arguments);
		this.isHelpVisible = false;
		this.classNames = ['sidebar-content-padding'];
	},

	actions: {
		showHelp() {
			this.set('isHelpVisible', true);
		}
	}
});
