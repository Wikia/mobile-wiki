import Ember from 'ember';

export default Ember.Component.extend({
	labelValue: Ember.computed('item.data.label', {
		get() {
			return this.get('item.data.label');
		},
		set(key, value) {
			this.get('editRowItem')(this.get('item'), value);
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
