import Ember from 'ember';

export default Ember.Component.extend({
	useArticleName: Ember.computed('item.data.defaultValue', {
		get() {
			return Boolean(this.get('item.data.defaultValue'));
		},
		set(key, value) {
			this.get('editTitleItem')(this.get('item'), value);
			return value;
		}
	}),

	init() {
		this._super(...arguments);
		this.isHelpVisible = false;
	},

	actions: {
		showHelp() {
			this.set('isHelpVisible', true);
		}
	}
});
